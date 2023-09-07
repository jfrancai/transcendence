import { useEffect, useState } from 'react';
import socket from '../socket';
import ConnectionState from './ConnectionState';
import ConnectionManager from './ConnectionManager';

export default function Chat() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onConnectError = () => {
      socket.io.opts.transports = ['polling', 'websocket'];
      setIsConnected(false);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  return (
    <div className="col-end-1 flex-col">
      <ConnectionState isConnected={isConnected} />
      <label
        htmlFor="Username"
        className="relative m-2 block w-60 rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type="text"
          id="Username"
          className="peer border-none bg-transparent p-2 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />

        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          Username
        </span>
      </label>

      <ConnectionManager username={username} />
    </div>
  );
}
