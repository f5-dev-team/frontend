import { create } from 'zustand';

// Zustand 전역 상태 예시 스토어.
// 컴포넌트에서 const count = useCounterStore((state) => state.count) 처럼 꺼내 씁니다.
// 나중에 실제 상태(로그인 정보 등)로 바꿔 쓰면 됩니다.
const useCounterStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
