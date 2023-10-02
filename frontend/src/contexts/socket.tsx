import React, { useContext, useMemo } from 'react';
import { PongSocket, Status } from '../utils/hooks/useStatus.interfaces';
import { useStatus } from '../utils/hooks/useStatus';
import { socket } from '../utils/functions/socket';

const SocketContext = React.createContext<{
  status: Status;
  socket: PongSocket;
} | null>(null);

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export function SocketContextProvider({
  children
}: SocketContextProviderProps) {
  const status = useStatus();
  const socketProviderValue = useMemo(() => ({ status, socket }), [status]);
  return (
    <SocketContext.Provider value={socketProviderValue}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      'useSocketContext must be used within a SocketContextProvider'
    );
  }
  return context;
}
