import socket from '../socket';

interface ConnectionManagerProps {
  username: string;
}

export default function ConnectionManager({
  username
}: ConnectionManagerProps) {
  const connect = () => {
    socket.auth = { username };
    socket.connect();
  };
  const disconnect = () => {
    socket.disconnect();
  };

  return (
    <div className="flex space-x-5">
      <button
        className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
        type="button"
        onClick={connect}
      >
        Connect
      </button>
      <button
        className="inline-block rounded bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
        type="button"
        onClick={disconnect}
      >
        Disconnect
      </button>
    </div>
  );
}
