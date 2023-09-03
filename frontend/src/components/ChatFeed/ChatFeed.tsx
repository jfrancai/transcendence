import ChatMessage from '../ChatMessage/ChatMessage';
import { Contact } from '../../utils/hooks/useSocket';
import { useMessages } from '../../utils/hooks/useMessages';
import { useScroll } from '../../utils/hooks/useScroll';

interface ChatFeedProps {
  contact: Contact | undefined;
  isConnected: boolean;
}

function ChatFeed({ contact, isConnected }: ChatFeedProps) {
  const messages = useMessages(contact, isConnected);
  const messageEndRef = useScroll(messages);

  return (
    <div>
      {messages.map((chat, index: number) => {
        if (index % 2) {
          return (
            <ChatMessage
              key={chat.messageID}
              message={chat.message}
              time={chat.time}
              username={chat.username}
              level={chat.level}
              profilePictureUrl={chat.profilePictureUrl}
              noBgColor
            />
          );
        }
        return (
          <ChatMessage
            key={chat.messageID}
            message={chat.message}
            time={chat.time}
            username={chat.username}
            level={chat.level}
            profilePictureUrl={chat.profilePictureUrl}
          />
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
}

export default ChatFeed;
