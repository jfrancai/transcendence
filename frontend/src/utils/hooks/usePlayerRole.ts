import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

export function usePlayerRole(): { playerRole: number } {
  const { socket } = useSocketContext();
  const [playerRole, setPlayerRole] = useState<number>(0);

  useEffect(() => {
    const onPlayerRole = (role: number) => {
      setPlayerRole(role);
    };

    socket.on('playerRole', onPlayerRole);
    return () => {
      socket.off('playerRole', onPlayerRole);
    };
  });
  return { playerRole };
}
