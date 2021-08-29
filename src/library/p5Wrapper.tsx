import { memo, ReactNode, useEffect, useRef } from 'react';
import p5 from 'p5';
import { FireworkState } from '../hooks/FireWorkContext';
import { FireworkDispatch } from '../hooks/FireWorkReducer';

export type P5WrapperType = p5 & {
  state?: FireworkState;
  dispatch?: FireworkDispatch;
};

type P5WrapperProps = {
  sketch: (p5: P5WrapperType) => void;
  state?: FireworkState;
  dispatch?: FireworkDispatch;
  children?: ReactNode;
  className?: string;
};

let canvas: P5WrapperType | null = null;
export const P5Wrapper = memo(
  (props: P5WrapperProps) => {
    const {
      sketch,
      state = [],
      dispatch = () => {},
      children,
      className,
    } = props;
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
      canvas = new p5(sketch, container.current || undefined);
      canvas.state = state;
      canvas.dispatch = dispatch;

      return () => {
        if (canvas) canvas.remove();
      };
    }, [dispatch, sketch, state]);

    return (
      <div ref={container} className={className}>
        {children}
      </div>
    );
  },
  (_, nextProps) => {
    if (canvas) canvas.state = nextProps?.state;
    return true;
  }
);
