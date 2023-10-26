import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useKeypress } from './useKeypress';

export function usePaddle() {
  const { socket } = useSocketContext();
  const isArrowUpPressed = useKeypress('ArrowUp');
  const isArrowDownPressed = useKeypress('ArrowDown');

  useEffect(() => {
    socket.emit('arrowUp', isArrowUpPressed);
  }, [socket, isArrowUpPressed]);

  useEffect(() => {
    socket.emit('arrowDown', isArrowDownPressed);
  }, [socket, isArrowDownPressed]);
}
