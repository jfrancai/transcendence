import { useEffect, useRef } from 'react';

export function useOutsideContext(callback: any) {
  const ref = useRef<any>();

  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('contextmenu', handleClick, true);

    return () => {
      document.removeEventListener('contextmenu', handleClick, true);
    };
  }, [ref, callback]);

  return ref;
}
