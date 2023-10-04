import { FaTelegramPlane } from 'react-icons/fa';
import { useState } from 'react';
import { useSocketContext } from '../../../contexts/socket';

interface SendMessageInputProps {
  receiverID: string;
}

export function SendMessageInput({ receiverID }: SendMessageInputProps) {
  const [message, setMessage] = useState('');
  const { socket } = useSocketContext();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (message.length !== 0) {
      const data = {
        content: message,
        userID: receiverID
      };
      socket.emit('privateMessage', data);
    }
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-14 w-full flex-shrink-0 items-center justify-between gap-y-24 bg-pong-blue-400 px-5"
      autoComplete="off"
    >
      <input
        type="text"
        id="UserEmail"
        autoComplete="false"
        placeholder="Send Message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="peer h-8 w-full border-none bg-transparent pr-3 text-pong-white placeholder-pong-blue-100 outline-none"
      />
      <button type="submit">
        <FaTelegramPlane className="h-6 w-6 text-pong-blue-100" />
      </button>
    </form>
  );
}
