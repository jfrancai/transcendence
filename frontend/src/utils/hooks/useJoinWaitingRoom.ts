import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { useGameOver } from './useGameOver';
import { useConnection } from './useConnection';

export function useJoinWaitingRoom(): { hasJoinWaitingRoom: boolean } {
  const { socket } = useSocketContext();
  const [hasJoinWaitingRoom, setHasJoinWaitingRoom] = useState(false);
  const { isGameOver } = useGameOver();
  const { pongStatus } = useConnection();

  useEffect(() => {
    if (pongStatus === 'waitingRoom') {
      setHasJoinWaitingRoom(true);
      socket.emit('initialState');
    } else {
      setHasJoinWaitingRoom(false);
    }
  }, [socket, pongStatus]);

  useEffect(() => {
    setHasJoinWaitingRoom(false);
  }, [isGameOver]);

  useEffect(() => {
    const onJoinWaitingRoom = () => {
      setHasJoinWaitingRoom(true);
    };
    socket.on('joinWaitingRoom', onJoinWaitingRoom);
    return () => {
      socket.off('joinWaitingRoom', onJoinWaitingRoom);
    };
  }, [socket]);

  return { hasJoinWaitingRoom };
}
