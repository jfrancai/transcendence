import { useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage';
import { useMessages } from '../../../utils/hooks/useMessages';
import { useScroll } from '../../../utils/hooks/useScroll';
import { Scrollable } from '../Scrollable/Scrollable';
import { useSocketContext } from '../../../contexts/socket';
import { useStateContext } from '../../../contexts/state';

interface ChanFeedProps {
  event: 'channelMessages' | 'messages';
  userID: string;
}

function ChanFeed({ userID, event }: ChanFeedProps) {
  const { socket } = useSocketContext();
  const messages = useMessages(userID);
  const messageEndRef = useScroll(messages);
  const { toggleChannelSettings } = useStateContext();

  useEffect(() => {
    const onChannelRestrict = (data: {
      userID: string;
      chanID: string;
      reason: string;
      type: string;
    }) => {
      if (socket.userID === data.userID) {
        toggleChannelSettings();
      }
    };
    socket.on('channelRestrict', onChannelRestrict);
    return () => {
      socket.off('channelRestrict', onChannelRestrict);
    };
  });

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
          />
        );
      })}
      <div ref={messageEndRef} />
    </Scrollable>
  );
}

export default ChanFeed;
