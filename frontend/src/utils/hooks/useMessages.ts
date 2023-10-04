import { useEffect, useState } from 'react';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';
import { useConnected } from './useConnected';
import { Message } from './useStatus.interfaces';
import { useSocketContext } from '../../contexts/socket';

export function useMessages(): ChatInfo[] {
  const { socket } = useSocketContext();
  const [msg, setMsg] = useState<ChatInfo[]>([]);
  const isConnected = useConnected();

  useEffect(() => {
    const onPrivateMessage = (message: Message) => {
      const formatedMessage = {
        id: message.messageID,
        message: message.content,
        time: formatTimeMessage(message.createdAt),
        username: message.sender,
        profilePictureUrl: 'starwatcher.jpg'
      };
      setMsg((m) => m.concat(formatedMessage));
    };
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
    socket.on('privateMessage', onPrivateMessage);
    return () => {
      socket.off('messages', onMessages);
      socket.off('privateMessage', onPrivateMessage);
    };
  }, [isConnected]);

  return msg;
}

export default {};
