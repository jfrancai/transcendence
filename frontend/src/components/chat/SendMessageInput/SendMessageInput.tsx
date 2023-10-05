import { FaTelegramPlane } from 'react-icons/fa';
import { useState } from 'react';
import { useSocketContext } from '../../../contexts/socket';

interface SendMessageInputProps {
  event: 'privateMessage' | 'channelMessage';
  receiverID: string;
}

export function SendMessageInput({ receiverID, event }: SendMessageInputProps) {
  const [message, setMessage] = useState('');
  const { socket } = useSocketContext();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (message.length !== 0) {
      const data: {
        content: string;
        userID?: string;
        chanID?: string;
      } = {
        content: message
      };
      if (event === 'privateMessage') {
        data.userID = receiverID;
      } else {
        data.chanID = receiverID;
      }
      console.log(data);

      socket.emit(event, data);
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
        onChange={(e) => setMessage(e.target.value)}
        className="peer h-8 w-full border-none bg-transparent pr-3 text-pong-white placeholder-pong-blue-100 outline-none"
      />
      <button type="submit">
        <FaTelegramPlane className="h-6 w-6 text-pong-blue-100" />
      </button>
    </form>
  );
}
