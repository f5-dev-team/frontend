// W-003: 학생 정보 입력 페이지

import { useState } from 'react';
import { Button, Select } from '../../components/ui';

function ProfilePage() {
  const [grade, setGrade] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('선택한 학년:', grade);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-blue-600">
          학생 정보 입력
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Select
            id="grade"
            label="학년"
            placeholder="학년을 선택하세요"
            required
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            options={[
              { value: '1', label: '1학년' },
              { value: '2', label: '2학년' },
              { value: '3', label: '3학년' },
              { value: '4', label: '4학년' },
            ]}
          />

          <Button type="submit">
            저장하기
          </Button>
        </form>
      </div>
    </main>
  );
}

export default ProfilePage;