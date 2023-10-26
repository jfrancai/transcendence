import { useEffect, useState } from 'react';

export function useKeypress(keycode: string): boolean {
  const [isPressed, setIsPressed] = useState(false);
  useEffect(() => {
    const handleDown = (event: KeyboardEvent) => {
      if (!isPressed && event.code === keycode) {
        setIsPressed(true);
      }
    };

    const handleUp = (event: KeyboardEvent) => {
      if (isPressed && event.code === keycode) {
        setIsPressed(false);
      }
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  });

  return isPressed;
}
