import useCounterStore from './store/useCounterStore';
import './App.css';

function App() {
  // Zustand 스토어에서 상태와 함수를 꺼내 씁니다.
  const count = useCounterStore((state) => state.count);
  const increase = useCounterStore((state) => state.increase);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div className="App">
      <h1>f5 Frontend</h1>
      <p>React + Vite + Zustand + Axios 초기 세팅 완료 ✅</p>

      <div className="card">
        <button type="button" onClick={increase}>
          count is {count}
        </button>
        <button type="button" onClick={reset} style={{ marginLeft: 8 }}>
          reset
        </button>
      </div>

      <p className="read-the-docs">
        버튼을 누르면 Zustand 전역 상태의 숫자가 올라갑니다.
      </p>
    </div>
  );
}

export default App;
