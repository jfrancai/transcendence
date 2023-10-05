import { useEffect, useState } from 'react';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';
import { useConnected } from './useConnected';
import { Message } from './useStatus.interfaces';
import { useSocketContext } from '../../contexts/socket';

export function useMessages(targetID: string): ChatInfo[] {
  const { socket } = useSocketContext();
  const [msg, setMsg] = useState<ChatInfo[]>([]);
  const isConnected = useConnected();

  useEffect(() => {
    const onChannelMessages = (messages: Message[]) => {
      const formatedMessages: any = [];
      messages.map((message: Message) => {
        formatedMessages.push({
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username: message.sender,
          chanName: message.chanName,
          chanID: message.chanID,
          profilePictureUrl: 'starwatcher.jpg'
        });
        return message;
      });
      setMsg(formatedMessages);
    };

    const onChannelMessage = (message: Message) => {
      if (targetID === message.chanID) {
        const formatedMessage = {
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username: message.sender,
          chanName: message.chanName,
          chanID: message.chanID,
          profilePictureUrl: 'starwatcher.jpg'
        };
        setMsg((m) => m.concat(formatedMessage));
      }
    };

    const onPrivateMessage = (message: Message) => {
      if (targetID === message.senderID || message.senderID === socket.userID) {
        const formatedMessage = {
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username: message.sender,
          profilePictureUrl: 'starwatcher.jpg'
        };
        setMsg((m) => m.concat(formatedMessage));
      }
    };
    const onMessages = (messages: Message[]) => {
      const formatedMessages: any = [];
      messages.map((message: Message) => {
        formatedMessages.push({
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username:
            socket.userID === message.receiverID
              ? message.receiver
              : message.sender,
          profilePictureUrl: 'starwatcher.jpg'
        });
        return message;
      });
      setMsg(formatedMessages);
    };

    socket.on('messages', onMessages);
    socket.on('privateMessage', onPrivateMessage);
    socket.on('channelMessages', onChannelMessages);
    socket.on('channelMessage', onChannelMessage);
    return () => {
      socket.off('messages', onMessages);
      socket.off('privateMessage', onPrivateMessage);
      socket.off('channelMessages', onChannelMessages);
      socket.off('channelMessage', onChannelMessage);
    };
  }, [isConnected, socket, targetID]);

  return msg;
}

export default {};
