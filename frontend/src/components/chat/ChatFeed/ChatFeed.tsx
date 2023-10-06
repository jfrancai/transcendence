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
    <Scrollable width={336}>
      {messages.length ? null : (
        <div className="mt-80 flex h-auto items-center justify-center ">
          <p className="text-2xl font-extrabold text-pong-blue-100">
            Start writing :)
          </p>
        </div>
      )}
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
    </Scrollable>
  );
}

export default ChatFeed;
