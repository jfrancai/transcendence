import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

export function usePlayerReady() {
  const { socket } = useSocketContext();
  const { SET_READY, SET_NOTREADY } = usePongStateContext();

  useEffect(() => {
    const onP1Ready = (ready: boolean) => {
      if (ready) {
        SET_READY();
      } else {
        SET_NOTREADY();
      }
    };

    socket.on('playerReady', onP1Ready);
    socket.on('isPlayerReady', onP1Ready);

    return () => {
      socket.off('playerReady', onP1Ready);
      socket.off('isPlayerReady', onP1Ready);
    };
  });
}
