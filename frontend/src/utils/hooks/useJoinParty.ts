import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { usePongStateContext } from '../../contexts/pongState';

export function useJoinParty() {
  const { socket } = useSocketContext();
  const { JOIN_PARTY_LOBBY } = usePongStateContext();

  useEffect(() => {
    socket.on('joinParty', JOIN_PARTY_LOBBY);
    return () => {
      socket.off('joinParty', JOIN_PARTY_LOBBY);
    };
  }, [socket, JOIN_PARTY_LOBBY]);
}
