import { useEffect, useState } from 'react';
import { Contact, PrivateMessage } from './useStatus';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';
import socket from '../../services/socket';

export function useMessages(
  contact: Contact | undefined,
  isConnected: boolean
): ChatInfo[] {
  const [messages, setMessages] = useState<ChatInfo[]>([]);

  useEffect(() => {
    if (contact !== undefined && contact.messages !== undefined) {
      const formatedMessages: any = [];
      contact.messages.map((message: PrivateMessage) => {
        const username =
          message.senderId === contact.userID
            ? contact.username
            : socket.username;
        formatedMessages.push({
          messageID: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.date),
          username,
          level: 42,
          profilePictureUrl: 'starwatcher.jpg'
        });
        return message;
      });
      setMessages(formatedMessages);
    }
    return () => setMessages([]);
  }, [contact, isConnected]);

  return messages;
}

export default {};
