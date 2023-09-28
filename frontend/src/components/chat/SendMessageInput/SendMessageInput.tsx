import { FaTelegramPlane } from 'react-icons/fa';
import { useState } from 'react';
import socket from '../../../services/socket';

interface SendMessageInputProps {
  receiverID: string;
  isConnected: boolean;
}

function SendMessageInput({ receiverID, isConnected }: SendMessageInputProps) {
  const [message, setMessage] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (message.length !== 0 && isConnected) {
      // setIsLoading(true);
      const data = {
        content: message,
        receiverID
      };
      socket.timeout(5000).emit('privateMessage', data, () => {
        // setIsLoading(false);
      });
    }
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-14 w-[336px] flex-shrink-0 items-center justify-between gap-y-24 bg-pong-blue-400 px-5"
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

export default SendMessageInput;
