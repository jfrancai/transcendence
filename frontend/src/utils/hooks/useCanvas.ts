import { useEffect, useRef } from 'react';

export function useCanvas(draw: (context: CanvasRenderingContext2D) => void) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    let animationFrameId: number;

    const renderer = () => {
      if (context) {
        draw(context);
      }
      animationFrameId = window.requestAnimationFrame(renderer);
    };
    renderer();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return ref;
}
