import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Wraps scrollable content inside ReactFlow nodes.
 * Stops wheel + touch events from reaching the ReactFlow canvas.
 */
const ScrollCapture: React.FC<Props> = ({ children, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e: WheelEvent | TouchEvent) => e.stopPropagation();
    el.addEventListener('wheel', stop, { passive: false });
    el.addEventListener('touchstart', stop, { passive: false });
    return () => {
      el.removeEventListener('wheel', stop);
      el.removeEventListener('touchstart', stop);
    };
  }, []);

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export default ScrollCapture;
