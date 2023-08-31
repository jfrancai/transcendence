import { useEffect, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed, { ChatInfo } from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { useScroll } from '../../utils/hooks/useScroll';
import { useSocket } from '../../utils/hooks/useSocket';
import { useContact } from '../../utils/hooks/useContact';
import { formatTimeMessage } from '../../utils/functions/parsing';

function Chat() {
  const [messages, setMessages] = useState<ChatInfo[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);
  const { contact, setContact } = useContact(setMessages);
  const [privateMessage, contactList] = useSocket(setIsConnected);
  const { messageEndRef, close, setClose } = useScroll(messages);

  useEffect(() => {
    if (privateMessage) {
      const chatInfo: ChatInfo = {
        username: 'toto',
        time: formatTimeMessage(privateMessage.date),
        message: privateMessage.content,
        profilePictureUrl: 'starwatcher.jpg',
        level: 42,
        messageID: privateMessage.messageID
      };
      setMessages((previous: any) => [...previous, chatInfo]);
    }
  }, [privateMessage]);

  return (
    <div className="w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          close ? '' : 'h-[758px] max-h-[90vh]'
        }  w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className="absolute z-30"
          isConnected={isConnected}
          handleClick={{
            toggleArrow: () => setClose(!close),
            openContactList: () => setContactListOpen(true)
          }}
        />
        <div className="invisible h-24">
          <ChatMessage
            message=""
            time=""
            username=""
            level={0}
            profilePictureUrl=""
          />
        </div>
        <Hide condition={close}>
          {contactListOpen ? (
            <div>
              <h2 className="text-white">Contact List</h2>
              {contactList.map((user: any) => {
                if (user.userID !== socket.userID) {
                  return (
                    <p className="text-white" key={user.userID}>
                      <button
                        type="button"
                        onClick={() => {
                          setContact(user);
                          setContactListOpen(false);
                        }}
                      >
                        {user.userID}
                      </button>
                    </p>
                  );
                }
                return '';
              })}
            </div>
          ) : (
            <>
              <ChatFeed messages={messages} />
              <div ref={messageEndRef} />
            </>
          )}
        </Hide>
      </div>

      <Hide condition={close}>
        <SendMessageInput
          to={contact ? contact.userID : ''}
          isConnected={isConnected}
        />
      </Hide>
    </div>
  );
}

export default Chat;
