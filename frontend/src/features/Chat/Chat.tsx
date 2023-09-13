import { useEffect, useState } from 'react';
import socket from '../../services/socket';
import ChatFeed from '../../components/ChatFeed/ChatFeed';
import ChatHeader from '../../components/ChatHeader/ChatHeader';
import ChatMessage from '../../components/ChatMessage/ChatMessage';
import Hide from '../../components/Hide/Hide';
import SendMessageInput from '../../components/SendMessageInput/SendMessageInput';
import { Contact, useStatus } from '../../utils/hooks/useStatus';
import { useContact } from '../../utils/hooks/useContact';

function Chat() {
  const [contactListOpen, setContactListOpen] = useState<boolean>(true);
  const [close, setClose] = useState<boolean>(true);

  const [status, setStatus] = useStatus();
  const [contact, setContact] = useContact(status);

  useEffect(() => {
    if (!status.privateMessage || !status.contactList) {
      return;
    }

    const updateContact = (newContact: Contact) => {
      if (
        contact?.userID === status?.privateMessage?.to ||
        status?.privateMessage?.from === contact?.userID
      ) {
        setContact(newContact);
      }
    };

    const newContactList = status.contactList.map((c: Contact) => {
      if (
        c.userID === status.privateMessage?.from ||
        c.userID === status.privateMessage?.to
      ) {
        const newContact = {
          ...c,
          messages: [...c.messages, status.privateMessage]
        };
        updateContact(newContact);
        return newContact;
      }
      return c;
    });
    setStatus({
      isConnected: status.isConnected,
      privateMessage: status.privateMessage,
      contactList: newContactList
    });
  }, [status.privateMessage]);

  return (
    <div className="w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          close ? '' : 'h-[758px] max-h-[90vh]'
        }  w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className="absolute z-30"
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
              <p className="text-red-400">{socket.userID}</p>
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
                        {user.userID}
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
          to={contact ? contact.userID : ''}
          isConnected={status.isConnected}
        />
      </Hide>
    </div>
  );
}

export default Chat;
