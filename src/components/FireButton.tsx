import { useCallback } from 'react';
import { useFirework } from '../hooks/FireWorkContext';

export const FireButton = () => {
  const [, setFirework] = useFirework();
  const onSubmit = useCallback(() => {
    setFirework({
      type: 'PUSH_FIREWORK',
      value: {
        color: {
          r: Math.random() * (255 - 0) + 0,
          g: Math.random() * (255 - 0) + 0,
          b: Math.random() * (255 - 0) + 0,
        },
        rainbow: false,
      },
    });
  }, [setFirework]);
  return (
    <button
      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'
      onClick={onSubmit}
    >
      FIRE
    </button>
  );
};
