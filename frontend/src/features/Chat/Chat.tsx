import { useEffect, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { Contact, useStatus } from '../../utils/hooks/useStatus';
import { useContact } from '../../utils/hooks/useContact';

const chat = new Map<string, Contact>();

function Chat() {
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);
  const [close, setClose] = useState<boolean>(true);
  const status = useStatus();
  const [contact, setContact] = useContact(status);

  useEffect(() => {
    status.contactList.forEach((c: Contact) => {
      chat.set(c.userID, c);
    });
  }, [status.contactList]);

  useEffect(() => {
    if (status.privateMessage) {
      const { senderId, receiverId } = status.privateMessage;
      const other = senderId === socket.userID ? receiverId : senderId;
      const messages = chat.get(other)?.messages;
      messages?.push(status.privateMessage);
    }
  }, [status.privateMessage]);

  useEffect(() => {
    if (status.privateMessage) {
      const { senderId, receiverId } = status.privateMessage;
      const other = senderId === socket.userID ? receiverId : senderId;
      const messages = chat.get(other)?.messages;
      if (senderId === contact?.userID || receiverId === contact?.userID) {
        setContact((c: any) => ({ ...c, messages }));
      }
    }
  }, [status.privateMessage, contact?.userID, setContact]);

  return (
    <div className="absolute bottom-2 right-2 w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          close ? '' : 'h-[758px] max-h-[90vh]'
        }  w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className={`absolute z-30 ${close ? '' : 'backdrop-blur'}`}
          isConnected={status.isConnected}
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
              <p className="text-red-400">{`${socket.username} ${socket.userID}`}</p>
              {status.contactList?.map((user: any) => {
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
                        {`${user.username} ${user.userID}`}
                      </button>
                    </p>
                  );
                }
                return '';
              })}
            </div>
          ) : (
            <ChatFeed contact={contact} isConnected={status.isConnected} />
          )}
        </Hide>
      </div>

      <Hide condition={close}>
        <SendMessageInput
          receiverId={contact ? contact.userID : ''}
          isConnected={status.isConnected}
        />
      </Hide>
    </div>
  );
}

export default Chat;
