import { useEffect, useState } from 'react';
import { Session } from './useStatus.interfaces';
import { useSocketContext } from '../../contexts/socket';

export function useSession(
  handleOnSession: (session: Session) => any = () => {}
): Session {
  const { socket } = useSocketContext();
  const [session, setSession] = useState<Session>({
    userID: socket.userID
  });
  useEffect(() => {
    const onSession = (data: Session) => {
      setSession({ userID: data.userID });
      handleOnSession(data);
    };
    socket.on('session', onSession);

    return () => {
      socket.off('session', onSession);
    };
  }, [socket, handleOnSession]);

  return session;
}
