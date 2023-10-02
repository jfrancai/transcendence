import ChatMessage from '../ChatMessage/ChatMessage';
import { useMessages } from '../../../utils/hooks/useMessages';
import { useScroll } from '../../../utils/hooks/useScroll';
import { Scrollable } from '../Scrollable/Scrollable';
import { Contact } from '../../../utils/hooks/useStatus.interfaces';

interface ChatFeedProps {
  contact: Contact | undefined;
}

function ChatFeed({ contact }: ChatFeedProps) {
  const messages = useMessages(contact);
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
