import { useEffect, useState } from 'react';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';
import { useConnected } from './useConnected';
import { Message } from './useStatus.interfaces';
import { socket } from '../functions/socket';

export function useMessages(): ChatInfo[] {
  const [msg, setMsg] = useState<ChatInfo[]>([]);
  const isConnected = useConnected();

  useEffect(() => {
    const onMessages = (messages: Message[]) => {
      const formatedMessages: any = [];
      messages.map((message: Message) => {
        formatedMessages.push({
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username: message.sender,
          profilePictureUrl: 'starwatcher.jpg'
        });
        return message;
      });
      setMsg(formatedMessages);
    };

    socket.on('messages', onMessages);
    return () => {
      socket.off('messages', onMessages);
    };
  }, [isConnected]);

  return msg;
}

export default {};
