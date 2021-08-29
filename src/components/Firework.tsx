import { useFirework } from '../hooks/FireWorkContext';
import { P5Wrapper } from '../library/p5Wrapper';
import { firework } from '../sketches/firework';

export const Firework = () => {
  const [fireworks, setFireworks] = useFirework();
  return (
    <P5Wrapper sketch={firework} state={fireworks} dispatch={setFireworks} />
  );
};
