import { createContext, ReactNode, useContext, useReducer } from 'react';
import { FireworkDispatch, FireWorkReducer } from './FireWorkReducer';

export type Firework = {
  color: {
    r: number;
    g: number;
    b: number;
  };
  rainbow: boolean;
};
export type FireworkState = Array<Firework>;

const FireworkStateContext = createContext<FireworkState | null>(null);
const FireworkDispatchContext = createContext<FireworkDispatch | null>(null);

const FireworkProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(FireWorkReducer, []);

  return (
    <FireworkDispatchContext.Provider value={dispatch}>
      <FireworkStateContext.Provider value={state}>
        {children}
      </FireworkStateContext.Provider>
    </FireworkDispatchContext.Provider>
  );
};

type useFireworkType = () => [FireworkState, FireworkDispatch];
const useFirework: useFireworkType = () => {
  const fireworks = useContext(FireworkStateContext);
  const setFirework = useContext(FireworkDispatchContext);
  if (fireworks === null || setFirework === null) {
    throw new Error('No context provided.');
  }
  return [fireworks, setFirework];
};

export { FireworkProvider, useFirework };
