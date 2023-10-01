import ChatMessage from '../ChatMessage/ChatMessage';
import { Contact } from '../../../utils/hooks/useStatus';
import { useMessages } from '../../../utils/hooks/useMessages';
import { useScroll } from '../../../utils/hooks/useScroll';
import { Scrollable } from '../Scrollable/Scrollable';

interface ChatFeedProps {
  contact: Contact | undefined;
  isConnected: boolean;
}

function ChatFeed({ contact, isConnected }: ChatFeedProps) {
  const messages = useMessages(contact, isConnected);
  const messageEndRef = useScroll(messages);

  return (
    <Scrollable>
      <div className="mt-28">
        {messages.map((chat, index: number) => {
          if (index % 2) {
            return (
              <ChatMessage
                key={chat.id}
                message={chat.message}
                time={chat.time}
                username={chat.username}
                profilePictureUrl={chat.profilePictureUrl}
                noBgColor
              />
            );
          }
          return (
            <ChatMessage
              key={chat.id}
              message={chat.message}
              time={chat.time}
              username={chat.username}
              profilePictureUrl={chat.profilePictureUrl}
            />
          );
        })}
        <div ref={messageEndRef} />
      </div>
    </Scrollable>
  );
}

export default ChatFeed;
