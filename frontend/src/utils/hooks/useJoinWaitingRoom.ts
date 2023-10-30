import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function useJoinWaitingRoom(): { hasJoinWaitingRoom: boolean } {
  const { socket } = useSocketContext();
  const [hasJoinWaitingRoom, setHasJoinWaitingRoom] = useState(false);

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
