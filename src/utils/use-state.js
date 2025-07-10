/**
 * initialValue: 초기 상태 값 (객체 형태)
 *
 * 반환값:
 * - getState: 현재 상태 값을 반환하는 함수
 * - setState: 상태 값을 업데이트하는 함수
 * - subscribe: 상태 변경 시 실행할 콜백 함수를 등록하는 함수
 *
 * 사용 예시:
 * @param {Object} initialValue
 * @returns {Array} [getState, setState, subscribe]
 */
export function useState(initialValue) {
  let state = { ...initialValue };
  let listeners = [];

  const setState = (newPartialState) => {
    state = { ...state, ...newPartialState };
    listeners.forEach((listener) => listener(state));
  };

  const getState = () => ({ ...state });

  const subscribe = (callback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l) => l !== callback);
    };
  };

  return [getState, setState, subscribe];
}
