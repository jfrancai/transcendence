import { CanvasHTMLAttributes } from 'react';
import { useCanvas } from '../../utils/hooks/useCanvas';

interface CanvasProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  draw: (context: CanvasRenderingContext2D) => void;
}

export function Canvas({ width, height, draw }: CanvasProps) {
  const ref = useCanvas(draw);

  return <canvas ref={ref} width={width} height={height} />;
}
