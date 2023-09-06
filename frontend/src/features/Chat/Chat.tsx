import { useEffect, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { Contact, useSocket } from '../../utils/hooks/useSocket';
import { useContact } from '../../utils/hooks/useContact';

function Chat() {
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);
  const [close, setClose] = useState<boolean>(true);

  const [contactList, setContactList, privateMessage, isConnected] =
    useSocket();
  const [contact, setContact] = useContact(contactList, isConnected);

  useEffect(() => {
    if (privateMessage && contactList) {
      const newContactList = contactList.map((c: Contact) => {
        if (
          c.userID === privateMessage.from ||
          c.userID === privateMessage.to
        ) {
          const newContact = {
            ...c,
            messages: c.messages.concat(privateMessage)
          };
          if (
            contact?.userID === privateMessage.to ||
            privateMessage.from === contact?.userID
          ) {
            setContact(newContact);
          }
          return newContact;
        }
        return c;
      });
      setContactList(newContactList);
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
              <p className="text-red-400">{socket.userID}</p>
              {contactList?.map((user: any) => {
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
            <ChatFeed contact={contact} />
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
