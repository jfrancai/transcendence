import { useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import { useMessages } from '../../../utils/hooks/useMessages';
import { useScroll } from '../../../utils/hooks/useScroll';
import { Scrollable } from '../Scrollable/Scrollable';
import { socket } from '../../../utils/functions/socket';

interface ChatFeedProps {
  userID: string | undefined;
}

function ChatFeed({ userID }: ChatFeedProps) {
  const messages = useMessages();
  const messageEndRef = useScroll(messages);

  useEffect(() => {
    if (userID) {
      socket.emit('messages', {
        userID
      });
    }
  }, [userID]);

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
