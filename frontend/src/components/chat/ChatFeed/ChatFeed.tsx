import { useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import { useMessages } from '../../../utils/hooks/useMessages';
import { useScroll } from '../../../utils/hooks/useScroll';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';

interface ChatFeedProps {
  event: 'channelMessages' | 'messages';
  userID: string;
}

function ChatFeed({ userID, event }: ChatFeedProps) {
  const { socket } = useSocketContext();
  const messages = useMessages(userID);
  const messageEndRef = useScroll(messages);

  useEffect(() => {
    if (userID.length !== 0) {
      if (event === 'messages') {
        socket.emit(event, {
          userID
        });
      } else {
        socket.emit(event, {
          chanID: userID
        });
      }
    }
  }, [userID, socket, event]);

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
