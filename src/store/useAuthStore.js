import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { setAuthToken } from '../api/axiosInstance';

// 로그인 정보(토큰·권한) 전역 스토어.
// 새로고침해도 유지되도록 sessionStorage에 저장하고, 복원할 때 axios 헤더에도 다시 붙입니다.
const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      role: null,

      // login/adminLogin API 응답(data)을 그대로 넘기면 됩니다.
      setSession: ({ accessToken, userId, role }) => {
        setAuthToken(accessToken);
        set({ accessToken, userId, role });
      },

      logout: () => {
        setAuthToken(null);
        set({ accessToken: null, userId: null, role: null });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) setAuthToken(state.accessToken);
      },
    },
  ),
);

export default useAuthStore;
