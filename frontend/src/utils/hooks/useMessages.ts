import { useEffect, useState } from 'react';
import { Contact, Message } from './useStatus';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';

export function useMessages(
  contact: Contact | undefined,
  isConnected: boolean
): ChatInfo[] {
  const [messages, setMessages] = useState<ChatInfo[]>([]);

  useEffect(() => {
    if (contact !== undefined && contact.messages !== undefined) {
      const formatedMessages: any = [];
      contact.messages.map((message: Message) => {
        formatedMessages.push({
          id: message.messageID,
          message: message.content,
          time: formatTimeMessage(message.createdAt),
          username: message.sender,
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
