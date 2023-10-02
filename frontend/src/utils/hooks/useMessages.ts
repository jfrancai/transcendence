import { useEffect, useState } from 'react';
import { ChatInfo } from './ChatInfo.interfaces';
import { formatTimeMessage } from '../functions/parsing';
import { useConnected } from './useConnected';
import { Contact, Message } from './useStatus.interfaces';

export function useMessages(contact: Contact | undefined): ChatInfo[] {
  const [messages, setMessages] = useState<ChatInfo[]>([]);
  const isConnected = useConnected();

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
