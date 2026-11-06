import { AxiosError } from 'axios';
import * as seed from './mockData';

// 실제 서버 대신 응답하는 axios adapter. 설계서 7.3의 API-001~018을 흉내 낸다.
// 저장한 값은 메모리에만 있어서 새로고침하면 초기 더미 데이터로 돌아간다.

const RESPONSE_DELAY_MS = 300;
const QUEUED_MS = 1000;
const RUNNING_MS = 2500;

const users = structuredClone(seed.users);
const profiles = structuredClone(seed.profiles);
const scholarships = structuredClone(seed.scholarships);
const analyses = new Map();

let nextUserId = 201;
let nextAnalysisId = 5001;
let nextConditionId = 9001;
let nextRequestId = 1;

const PROFILE_FIELDS = [
  'department',
  'grade',
  'enrollmentStatus',
  'cumulativeGpa',
  'previousSemesterGpa',
  'incomeBracket',
  'volunteerHours',
  'age',
  'residenceAddress',
  'gender',
];
const NUMERIC_PROFILE_FIELDS = [
  'grade',
  'cumulativeGpa',
  'previousSemesterGpa',
  'incomeBracket',
  'volunteerHours',
  'age',
];
const PATCHABLE_FIELDS = [
  'title',
  'organization',
  'description',
  'applicationStartAt',
  'applicationEndAt',
  'applicationPeriodText',
  'requirements',
];
const UNITS = {
  cumulativeGpa: '학점',
  previousSemesterGpa: '학점',
  volunteerHours: '시간',
  incomeBracket: '구간',
};
const HTTP_TITLES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

class MockApiError extends Error {
  constructor(status, code, detail, errors = [], headers = {}) {
    super(detail);
    Object.assign(this, { status, code, detail, errors, headers });
  }
}

const notFound = () =>
  new MockApiError(404, 'RESOURCE_NOT_FOUND', '요청한 정보를 찾을 수 없습니다.');
const invalid = (field, reason) =>
  new MockApiError(400, 'VALIDATION_ERROR', '입력값을 확인해 주세요.', [{ field, reason }]);
const authenticationFailed = () =>
  new MockApiError(401, 'AUTHENTICATION_FAILED', '이메일 또는 비밀번호가 올바르지 않습니다.');

const createRequestId = () => `req-mock-${nextRequestId++}`;

const toKoreaIso = (ms) =>
  new Date(ms + 9 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '+09:00');
const nowIso = () => toKoreaIso(Date.now());

const paginate = (items, query) => {
  const page = Number(query.page ?? 0);
  const size = Number(query.size ?? 20);
  if (!Number.isInteger(page) || page < 0) throw invalid('page', '0 이상의 정수여야 합니다.');
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    throw invalid('size', '1~100 사이의 정수여야 합니다.');
  }
  return {
    items: items.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
  };
};

const findScholarship = (scholarshipId) => {
  const scholarship = scholarships.find((item) => item.scholarshipId === scholarshipId);
  if (!scholarship) throw notFound();
  return scholarship;
};

const toPublicScholarship = (scholarship) => {
  const publicScholarship = { ...scholarship };
  delete publicScholarship.collectedAt;
  delete publicScholarship.processingError;
  return publicScholarship;
};

const issueSession = (user) => ({
  accessToken: `mock-token-${user.userId}`,
  tokenType: 'Bearer',
  expiresIn: 3600,
  userId: user.userId,
  role: user.role,
});

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase();

const findAccount = (body) => {
  const email = normalizeEmail(body.email);
  const user = users.find((item) => item.email === email && item.password === body.password);
  if (!user) throw authenticationFailed();
  return user;
};

const getPeriodStatus = ({ applicationStartAt, applicationEndAt }, at) => {
  const start = applicationStartAt ? Date.parse(applicationStartAt) : null;
  const end = applicationEndAt ? Date.parse(applicationEndAt) : null;
  if (start !== null && end !== null && start > end) return 'UNKNOWN';
  if (start !== null && at < start) return 'NOT_STARTED';
  if (end !== null && at > end) return 'CLOSED';
  return start !== null && end !== null ? 'OPEN' : 'UNKNOWN';
};

const isConditionMet = ({ operator, expectedValue }, actual) => {
  if (operator === 'GTE') return actual >= expectedValue;
  if (operator === 'LTE') return actual <= expectedValue;
  if (operator === 'IN') return expectedValue.includes(actual);
  return actual === expectedValue;
};

const toConditionResult = (condition, actual, reasonCode, message) => {
  const isNumeric = typeof actual === 'number' && typeof condition.expectedValue === 'number';
  return {
    conditionId: condition.conditionId,
    field: condition.field,
    required: condition.required,
    actualValue: actual,
    expectedDescription: condition.description,
    gap: isNumeric
      ? Math.round(Math.abs(condition.expectedValue - actual) * 100) / 100
      : null,
    unit: isNumeric ? (UNITS[condition.field] ?? null) : null,
    reasonCode,
    message,
  };
};

const judgeScholarship = (scholarship, profile, userId, at) => {
  const unmetConditions = [];
  const unresolvedConditions = [];
  const waived = seed.waivedConditions[userId] ?? [];

  scholarship.requirements
    .filter((condition) => condition.required && !waived.includes(condition.conditionId))
    .forEach((condition) => {
      const actual = condition.field === 'other' ? null : profile[condition.field];
      const { description } = condition;

      if (condition.operator === 'TEXT') {
        unresolvedConditions.push(
          toConditionResult(
            condition,
            actual,
            'AMBIGUOUS_CONDITION',
            `${description} 조건은 직접 확인이 필요합니다.`,
          ),
        );
      } else if (actual === null) {
        unresolvedConditions.push(
          toConditionResult(
            condition,
            actual,
            'PROFILE_VALUE_MISSING',
            `${description} 조건을 확인할 정보가 없습니다.`,
          ),
        );
      } else if (!isConditionMet(condition, actual)) {
        unmetConditions.push(
          toConditionResult(
            condition,
            actual,
            'CONDITION_NOT_MET',
            `${description} 조건을 충족하지 못했습니다.`,
          ),
        );
      }
    });

  const exclusionMessage = seed.excludedUsers[userId];
  if (exclusionMessage) {
    unmetConditions.push({
      conditionId: null,
      field: 'other',
      required: true,
      actualValue: null,
      expectedDescription: '지원 제외 대상이 아닐 것',
      gap: null,
      unit: null,
      reasonCode: 'CONDITION_NOT_MET',
      message: exclusionMessage,
    });
  }

  let eligibilityStatus = 'ELIGIBLE';
  if (unmetConditions.length > 0) eligibilityStatus = 'INELIGIBLE';
  else if (unresolvedConditions.length > 0) eligibilityStatus = 'NEEDS_REVIEW';

  const reasons = [...unmetConditions, ...unresolvedConditions].map((item) => item.message);
  const applicationPeriodStatus = getPeriodStatus(scholarship, at);

  return {
    scholarshipId: scholarship.scholarshipId,
    scholarshipVersion: scholarship.version,
    title: scholarship.title,
    applicationEndAt: scholarship.applicationEndAt,
    eligibilityStatus,
    applicationPeriodStatus,
    applicationPeriodMessage:
      applicationPeriodStatus === 'UNKNOWN' ? '신청 기간을 확인해 주세요.' : null,
    reasons: reasons.length > 0 ? reasons : ['모든 자격조건을 충족했습니다.'],
    unmetConditions,
    unresolvedConditions,
  };
};

const getExclusionReason = (scholarship, at) => {
  if (scholarship.processingStatus === 'FAILED') return 'PROCESSING_FAILED';
  if (scholarship.processingStatus !== 'READY') return 'PROCESSING_PENDING';
  return getPeriodStatus(scholarship, at) === 'CLOSED' ? 'DEADLINE_PASSED' : null;
};

const findOwnAnalysis = (analysisId, user) => {
  const analysis = analyses.get(analysisId);
  if (!analysis || analysis.userId !== user.userId) throw notFound();
  return analysis;
};

const getAnalysisStatus = (analysis) => {
  const elapsed = Date.now() - analysis.createdMs;
  if (elapsed < QUEUED_MS) return 'QUEUED';
  if (elapsed < RUNNING_MS) return 'RUNNING';
  return analysis.isFailing ? 'FAILED' : 'COMPLETED';
};

const assertCompleted = (analysis) => {
  const status = getAnalysisStatus(analysis);
  if (status === 'FAILED') {
    throw new MockApiError(409, 'ANALYSIS_FAILED', '분석에 실패했습니다. 다시 요청해 주세요.');
  }
  if (status !== 'COMPLETED') {
    throw new MockApiError(409, 'ANALYSIS_NOT_COMPLETED', '분석이 아직 끝나지 않았습니다.');
  }
};

const toDocumentAccess = (scholarship, documentId) => {
  const document = scholarship.documents.find((item) => item.documentId === documentId);
  if (!document) throw notFound();
  return {
    ...document,
    sourceUrl: scholarship.sourceUrl,
    downloadUrl: `https://example.org/signed-documents/${documentId}?signature=MOCK`,
    expiresAt: toKoreaIso(Date.now() + 5 * 60 * 1000),
  };
};

const validateProfile = (body) => {
  const extra = Object.keys(body).find((key) => !PROFILE_FIELDS.includes(key));
  if (extra) throw invalid(extra, '정의되지 않은 항목입니다.');

  const missing = PROFILE_FIELDS.find((field) => !(field in body));
  if (missing) throw invalid(missing, '필수 항목입니다. 미확인 값은 null로 보내 주세요.');

  const wrongNumber = NUMERIC_PROFILE_FIELDS.find(
    (field) => body[field] !== null && (typeof body[field] !== 'number' || body[field] < 0),
  );
  if (wrongNumber) throw invalid(wrongNumber, '0 이상의 숫자여야 합니다.');
};

const validateScholarshipPatch = (scholarship, body) => {
  const { version, ...changes } = body;

  if (!Number.isInteger(version)) throw invalid('version', '현재 버전을 보내 주세요.');

  const unknown = Object.keys(changes).find((key) => !PATCHABLE_FIELDS.includes(key));
  if (unknown) throw invalid(unknown, '수정할 수 없는 항목입니다.');
  if (Object.keys(changes).length === 0) throw invalid('version', '수정할 항목이 없습니다.');
  if ('title' in changes && !changes.title) throw invalid('title', '제목은 비울 수 없습니다.');
  if ('requirements' in changes && !Array.isArray(changes.requirements)) {
    throw invalid('requirements', '조건 목록은 배열이어야 합니다.');
  }

  const merged = { ...scholarship, ...changes };
  if (
    merged.applicationStartAt &&
    merged.applicationEndAt &&
    Date.parse(merged.applicationStartAt) > Date.parse(merged.applicationEndAt)
  ) {
    throw invalid('applicationEndAt', '마감 일시는 시작 일시 이후여야 합니다.');
  }

  if (version !== scholarship.version) {
    throw new MockApiError(
      409,
      'VERSION_CONFLICT',
      '다른 변경 사항이 저장되었습니다. 최신 정보를 조회한 후 다시 수정해 주세요.',
    );
  }
  return changes;
};

const handlers = {
  // API-001
  register: ({ body }) => {
    const email = normalizeEmail(body.email);
    if (!/^[^\s@]+@gachon\.ac\.kr$/.test(email)) {
      throw invalid('email', '가천대학교 이메일을 입력해 주세요.');
    }
    if (!body.password) throw invalid('password', '비밀번호를 입력해 주세요.');
    if (users.some((user) => user.email === email)) {
      throw new MockApiError(409, 'EMAIL_ALREADY_EXISTS', '이미 가입된 이메일입니다.');
    }

    const user = {
      userId: String(nextUserId++),
      email,
      password: body.password,
      role: 'USER',
      createdAt: nowIso(),
    };
    users.push(user);

    const { userId, role, createdAt } = user;
    return { status: 201, data: { userId, email, role, createdAt } };
  },

  // API-002
  login: ({ body }) => {
    const user = findAccount(body);
    if (user.role !== 'USER') throw authenticationFailed();
    return { data: issueSession(user) };
  },

  // API-003
  getProfile: ({ user }) => {
    const profile = profiles[user.userId];
    if (!profile) throw notFound();
    return { data: profile };
  },

  // API-004
  saveProfile: ({ user, body }) => {
    validateProfile(body);

    const current = profiles[user.userId];
    if (!current) {
      profiles[user.userId] = { ...body, version: 1, updatedAt: nowIso() };
      return { status: 201, data: profiles[user.userId] };
    }

    const isSame = PROFILE_FIELDS.every((field) => current[field] === body[field]);
    if (!isSame) {
      profiles[user.userId] = { ...body, version: current.version + 1, updatedAt: nowIso() };
    }
    return { data: profiles[user.userId] };
  },

  // API-005
  createAnalysis: ({ user, body }) => {
    if (!Number.isInteger(body.profileVersion) || body.profileVersion < 1) {
      throw invalid('profileVersion', '1 이상의 정수여야 합니다.');
    }

    const profile = profiles[user.userId];
    if (!profile) {
      throw new MockApiError(409, 'PROFILE_REQUIRED', '학생 정보를 먼저 저장해 주세요.');
    }
    if (profile.version !== body.profileVersion) {
      throw new MockApiError(409, 'VERSION_CONFLICT', '학생 정보가 변경되었습니다.');
    }

    const at = Date.now();
    const exclusionCounts = {};
    const targets = scholarships.filter((scholarship) => {
      const reason = getExclusionReason(scholarship, at);
      if (reason) exclusionCounts[reason] = (exclusionCounts[reason] ?? 0) + 1;
      return !reason;
    });

    const analysis = {
      analysisId: String(nextAnalysisId++),
      userId: user.userId,
      profileVersion: profile.version,
      createdAt: nowIso(),
      createdMs: at,
      isFailing: seed.failingUsers.includes(user.userId),
      candidateCount: scholarships.length,
      exclusions: Object.entries(exclusionCounts).map(([reason, count]) => ({ reason, count })),
      snapshots: structuredClone(targets),
      items: targets.map((item) => judgeScholarship(item, profile, user.userId, at)),
    };
    analyses.set(analysis.analysisId, analysis);

    return {
      status: 202,
      headers: { location: `/api/v1/analyses/${analysis.analysisId}` },
      data: {
        analysisId: analysis.analysisId,
        status: 'QUEUED',
        profileVersion: analysis.profileVersion,
        createdAt: analysis.createdAt,
      },
    };
  },

  // API-006
  getAnalysis: ({ user, params }) => {
    const analysis = findOwnAnalysis(params[0], user);
    const status = getAnalysisStatus(analysis);
    const totalCount = analysis.items.length;
    const isFinished = status === 'COMPLETED' || status === 'FAILED';

    return {
      data: {
        analysisId: analysis.analysisId,
        status,
        profileVersion: analysis.profileVersion,
        totalCount,
        candidateCount: analysis.candidateCount,
        excludedCount: analysis.candidateCount - totalCount,
        exclusions: analysis.exclusions,
        processedCount: status === 'COMPLETED' ? totalCount : 0,
        createdAt: analysis.createdAt,
        startedAt: status === 'QUEUED' ? null : toKoreaIso(analysis.createdMs + QUEUED_MS),
        completedAt: isFinished ? toKoreaIso(analysis.createdMs + RUNNING_MS) : null,
        failure:
          status === 'FAILED'
            ? { code: 'ANALYSIS_PROCESSING_FAILED', message: '분석 처리 중 오류가 발생했습니다.' }
            : null,
      },
    };
  },

  // API-007
  getRecommendations: ({ user, params, query }) => {
    const analysis = findOwnAnalysis(params[0], user);
    assertCompleted(analysis);

    const { eligibilityStatus } = query;
    const statuses = ['ELIGIBLE', 'INELIGIBLE', 'NEEDS_REVIEW'];
    if (eligibilityStatus !== undefined && !statuses.includes(eligibilityStatus)) {
      throw invalid('eligibilityStatus', '허용되지 않은 값입니다.');
    }

    const items = analysis.items
      .filter((item) => !eligibilityStatus || item.eligibilityStatus === eligibilityStatus)
      .sort((a, b) => Number(b.scholarshipId) - Number(a.scholarshipId));

    return {
      data: {
        analysisId: analysis.analysisId,
        profileVersion: analysis.profileVersion,
        ...paginate(items, query),
      },
    };
  },

  // API-008
  getEvidence: ({ user, params }) => {
    const analysis = findOwnAnalysis(params[0], user);
    assertCompleted(analysis);

    const snapshot = analysis.snapshots.find((item) => item.scholarshipId === params[1]);
    if (!snapshot) throw notFound();

    return {
      data: {
        analysisId: analysis.analysisId,
        scholarshipId: snapshot.scholarshipId,
        scholarshipVersion: snapshot.version,
        evidenceStatus: 'AVAILABLE',
        sourceUrl: snapshot.sourceUrl,
        documents: snapshot.documents,
        items: snapshot.requirements.map((condition) => ({
          conditionId: condition.conditionId,
          documentId: snapshot.documents[0]?.documentId ?? null,
          quote: condition.sourceQuote,
          explanation: `${condition.description} 조건을 판정에 사용했습니다.`,
          page: 1,
          section: '지원 자격',
          sourceUrl: snapshot.sourceUrl,
        })),
        message: null,
      },
    };
  },

  // API-009
  getScholarship: ({ params }) => ({ data: toPublicScholarship(findScholarship(params[0])) }),

  // API-010, API-018
  getDocument: ({ params }) => ({ data: toDocumentAccess(findScholarship(params[0]), params[1]) }),

  // API-011
  getNotifications: ({ query }) => ({ data: paginate(seed.notifications, query) }),

  // API-012
  adminLogin: ({ body }) => {
    const user = findAccount(body);
    if (user.role !== 'ADMIN') {
      throw new MockApiError(403, 'FORBIDDEN', '관리자 권한이 없습니다.');
    }
    return { data: issueSession(user) };
  },

  // API-013
  getAdminScholarships: ({ query }) => {
    const items = [...scholarships]
      .sort((a, b) => Date.parse(b.collectedAt) - Date.parse(a.collectedAt))
      .map((item) => ({
        scholarshipId: item.scholarshipId,
        title: item.title,
        sourceUrl: item.sourceUrl,
        collectedAt: item.collectedAt,
        processingStatus: item.processingStatus,
        applicationEndAt: item.applicationEndAt,
        version: item.version,
      }));
    return { data: paginate(items, query) };
  },

  // API-014
  getAdminScholarship: ({ params }) => ({ data: findScholarship(params[0]) }),

  // API-015
  updateAdminScholarship: ({ params, body }) => {
    const scholarship = findScholarship(params[0]);
    const changes = validateScholarshipPatch(scholarship, body);

    if (changes.requirements) {
      changes.requirements = changes.requirements.map((condition) => ({
        ...condition,
        conditionId: condition.conditionId ?? `c${nextConditionId++}`,
      }));
    }

    const isChanged = Object.entries(changes).some(
      ([key, value]) => JSON.stringify(scholarship[key]) !== JSON.stringify(value),
    );
    if (isChanged) {
      Object.assign(scholarship, changes, {
        version: scholarship.version + 1,
        updatedAt: nowIso(),
      });
    }
    return { data: scholarship };
  },

  // API-016
  getCrawlRuns: ({ query }) => {
    const items = seed.crawlRuns
      .filter((run) => !query.status || run.status === query.status)
      .map((run) => ({
        crawlRunId: run.crawlRunId,
        status: run.status,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        discoveredCount: run.discoveredCount,
        collectedCount: run.collectedCount,
        skippedCount: run.skippedCount,
        failedCount: run.failedCount,
      }));
    return { data: paginate(items, query) };
  },

  // API-017
  getCrawlRun: ({ params }) => {
    const run = seed.crawlRuns.find((item) => item.crawlRunId === params[0]);
    if (!run) throw notFound();
    return { data: run };
  },
};

// [메서드, 경로, 필요한 권한, 처리 함수]
const routes = [
  ['POST', '/users', null, handlers.register],
  ['POST', '/sessions', null, handlers.login],
  ['GET', '/users/me/student-profile', 'USER', handlers.getProfile],
  ['PUT', '/users/me/student-profile', 'USER', handlers.saveProfile],
  ['POST', '/analyses', 'USER', handlers.createAnalysis],
  ['GET', '/analyses/:id', 'USER', handlers.getAnalysis],
  ['GET', '/analyses/:id/recommendations', 'USER', handlers.getRecommendations],
  ['GET', '/analyses/:id/recommendations/:id/evidence', 'USER', handlers.getEvidence],
  ['GET', '/scholarships/:id', 'USER', handlers.getScholarship],
  ['GET', '/scholarships/:id/documents/:id', 'USER', handlers.getDocument],
  ['GET', '/users/me/notifications', 'USER', handlers.getNotifications],
  ['POST', '/admin/sessions', null, handlers.adminLogin],
  ['GET', '/admin/scholarships', 'ADMIN', handlers.getAdminScholarships],
  ['GET', '/admin/scholarships/:id', 'ADMIN', handlers.getAdminScholarship],
  ['PATCH', '/admin/scholarships/:id', 'ADMIN', handlers.updateAdminScholarship],
  ['GET', '/admin/crawl-runs', 'ADMIN', handlers.getCrawlRuns],
  ['GET', '/admin/crawl-runs/:id', 'ADMIN', handlers.getCrawlRun],
  ['GET', '/admin/scholarships/:id/documents/:id', 'ADMIN', handlers.getDocument],
].map(([method, path, role, handler]) => ({
  method,
  pattern: new RegExp(`^${path.replaceAll(':id', '([^/]+)')}$`),
  role,
  handler,
}));

const authenticate = (config, requiredRole) => {
  const header = config.headers?.get?.('Authorization') ?? config.headers?.Authorization;
  const userId = /^Bearer mock-token-(\d+)$/.exec(header ?? '')?.[1];
  const user = users.find((item) => item.userId === userId);

  if (!user) {
    throw new MockApiError(401, 'TOKEN_INVALID', '다시 로그인해 주세요.', [], {
      'www-authenticate': 'Bearer',
    });
  }
  if (user.role !== requiredRole) {
    throw new MockApiError(403, 'FORBIDDEN', '접근 권한이 없습니다.');
  }
  return user;
};

const parseBody = (config) => {
  if (!config.data) return {};
  if (typeof config.data !== 'string') return config.data;
  try {
    return JSON.parse(config.data);
  } catch {
    throw invalid('body', 'JSON 형식이 올바르지 않습니다.');
  }
};

const handleRequest = (config) => {
  const method = config.method.toUpperCase();
  const path = config.url.split('?')[0];

  for (const route of routes) {
    const match = route.method === method ? route.pattern.exec(path) : null;
    if (match) {
      return route.handler({
        user: route.role ? authenticate(config, route.role) : null,
        params: match.slice(1),
        query: config.params ?? {},
        body: parseBody(config),
      });
    }
  }
  throw notFound();
};

const toProblem = (error) => {
  const requestId = createRequestId();
  return {
    type: 'about:blank',
    title: HTTP_TITLES[error.status],
    status: error.status,
    detail: error.detail,
    instance: `urn:uuid:${requestId}`,
    code: error.code,
    errors: error.errors,
    requestId,
  };
};

export async function mockAdapter(config) {
  await new Promise((resolve) => {
    setTimeout(resolve, RESPONSE_DELAY_MS);
  });

  try {
    const { status = 200, data, headers = {} } = handleRequest(config);
    return {
      // 응답을 복사해서, 화면이 값을 바꿔도 Mock 저장 데이터가 변하지 않게 한다.
      data: { data: structuredClone(data), meta: { requestId: createRequestId() } },
      status,
      statusText: '',
      headers: { 'content-type': 'application/json', ...headers },
      config,
      request: {},
    };
  } catch (error) {
    if (!(error instanceof MockApiError)) throw error;

    throw new AxiosError(
      `Request failed with status code ${error.status}`,
      AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      {
        data: toProblem(error),
        status: error.status,
        statusText: HTTP_TITLES[error.status],
        headers: { 'content-type': 'application/problem+json', ...error.headers },
        config,
        request: {},
      },
    );
  }
}
