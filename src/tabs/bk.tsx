import { useRef, useEffect } from 'react';
import webGLFluidEnhanced from 'webgl-fluid-enhanced';
import { updateColors } from '../utils/colors';

export function Back() {
  const canvasRef = useRef(null);
  const propagateMouseEvent = (event: MouseEvent) => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    if (!canvas || event.target === canvas) return;
    const clonedEvent = new MouseEvent(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      clientX: event.clientX,
      clientY: event.clientY,
    });
    canvas.dispatchEvent(clonedEvent);
  };

  useEffect(() => {
    updateColors();
    const canvas = canvasRef.current;
    const root = getComputedStyle(document.documentElement);
    if (canvas) {
      webGLFluidEnhanced.simulation(canvas, {
        COLOR_PALETTE: [
          root.getPropertyValue('--color-primary'),
          root.getPropertyValue('--color-secondary'),
          root.getPropertyValue('--color-accent'),
        ],
        BACK_COLOR: root.getPropertyValue('--color-background'),
      });
    }

    document.addEventListener('click', propagateMouseEvent);
    document.addEventListener('mousemove', propagateMouseEvent);
    document.addEventListener('mousedown', propagateMouseEvent);
    document.addEventListener('mouseup', propagateMouseEvent);
    document.addEventListener('mouseover', propagateMouseEvent);
    document.addEventListener('mouseout', propagateMouseEvent);

    return () => {
      document.removeEventListener('click', propagateMouseEvent);
      document.removeEventListener('mousemove', propagateMouseEvent);
      document.removeEventListener('mousedown', propagateMouseEvent);
      document.removeEventListener('mouseup', propagateMouseEvent);
      document.removeEventListener('mouseover', propagateMouseEvent);
      document.removeEventListener('mouseout', propagateMouseEvent);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'auto'
      }}
    />
  );
}
