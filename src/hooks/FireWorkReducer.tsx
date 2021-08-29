import { Dispatch } from 'react';
import { Firework, FireworkState } from './FireWorkContext';

type Action =
  | { type: 'PUSH_FIREWORK'; value: Firework }
  | { type: 'SHIFT_FIREWORK' };
export type FireworkDispatch = Dispatch<Action>;

export const FireWorkReducer = (state: FireworkState, action: Action) => {
  switch (action.type) {
    case 'PUSH_FIREWORK':
      return state.concat(action.value);
    case 'SHIFT_FIREWORK':
      return state.filter((_, i) => i !== 0);
    default:
      throw new Error('Invalid action');
  }
};
