import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import socket from '../../services/socket';
import ChatFeed from '../../components/chat/ChatFeed/ChatFeed';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import ChatMessage from '../../components/chat/ChatMessage/ChatMessage';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import SendMessageInput from '../../components/chat/SendMessageInput/SendMessageInput';
import { Contact, useStatus } from '../../utils/hooks/useStatus';
import { useContact } from '../../utils/hooks/useContact';
import { chatMachine } from '../../machines/chatMachine';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';

const chat = new Map<string, Contact>();

function Chat() {
  const status = useStatus();
  const [contact, setContact] = useContact(status);
  const [state, send] = useMachine(chatMachine);

  const isChatClosed = state.matches('closed');

  const isMessageView = state.matches({ opened: 'messageView' });
  const isChannelView = state.matches({ opened: 'channelView' });
  const isSearchView = state.matches({ opened: 'searchView' });
  const isNotificationView = state.matches({ opened: 'notificationView' });

  const isConversationView = state.matches({ opened: 'conversationView' });
  const isChanConversationView = state.matches({
    opened: 'channelConversationView'
  });
  const toggleChat = () => {
    send(isChatClosed ? 'OPEN' : 'CLOSE');
  };

  useEffect(() => {
    status.contactList.forEach((c: Contact) => {
      chat.set(c.userID, c);
    });
  }, [status.contactList]);

  useEffect(() => {
    if (status.privateMessage) {
      const { senderID, receiverID } = status.privateMessage;
      const other = senderID === socket.userID ? receiverID : senderID;
      const messages = chat.get(other)?.messages;
      messages?.push(status.privateMessage);
    }
  }, [status.privateMessage]);

  useEffect(() => {
    if (status.privateMessage) {
      const { senderID, receiverID } = status.privateMessage;
      const other = senderID === socket.userID ? receiverID : senderID;
      const messages = chat.get(other)?.messages;
      if (senderID === contact?.userID || receiverID === contact?.userID) {
        setContact((c: any) => ({ ...c, messages }));
      }
    }
  }, [status.privateMessage, contact?.userID, setContact]);

  return (
    <div className="absolute bottom-2 right-2 w-fit overflow-hidden rounded-3xl">
      <div
        className={`hide-scrollbar ${
          isChatClosed ? '' : 'h-[758px] max-h-[90vh]'
        } w-fit shrink-0 flex-col-reverse items-center justify-end overflow-y-scroll rounded-t-3xl bg-pong-blue-300`}
      >
        <ChatHeader
          className={`absolute z-30 ${isChatClosed ? '' : 'backdrop-blur'}`}
          isConnected={status.isConnected}
          handleClick={{
            toggleArrow: toggleChat,
            changeView: () => send({ type: 'selectHeader' })
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
        <RenderIf some={[isConversationView]}>
          <ChatFeed contact={contact} isConnected={status.isConnected} />
        </RenderIf>
        <RenderIf some={[isMessageView]}>
          <div>
            <h2 className="text-white">Contact List</h2>
            <p className="text-red-400">{`${socket.username}`}</p>
            {status.contactList?.map((user: any) => {
              if (user.userID !== socket.userID) {
                return (
                  <p className="text-white" key={user.userID}>
                    <button
                      type="button"
                      onClick={() => {
                        setContact(user);
                        send('selectContact');
                      }}
                    >
                      {`${user.username}`}
                    </button>
                  </p>
                );
              }
              return '';
            })}
          </div>
        </RenderIf>
        <RenderIf some={[isChannelView]}>
          <p className="text-white">Channel view</p>
        </RenderIf>
        <RenderIf some={[isSearchView]}>
          <p className="text-white">searchView</p>
        </RenderIf>
        <RenderIf some={[isNotificationView]}>
          <p className="text-white">notificationView</p>
        </RenderIf>
      </div>
      <RenderIf some={[isConversationView, isChanConversationView]}>
        <SendMessageInput
          receiverID={contact ? contact.userID : ''}
          isConnected={status.isConnected}
        />
      </RenderIf>
      <RenderIf
        some={[isMessageView, isChannelView, isSearchView, isNotificationView]}
      >
        <MenuSelector
          isMessageView={isMessageView}
          isChannelView={isChannelView}
          isSearchView={isSearchView}
          isNotificationView={isNotificationView}
          toggleMessageView={() => send('clickOnMessage')}
          toggleChannelView={() => send('clickOnChannel')}
          toggleNotificationView={() => send('clickOnNotification')}
          toggleSearchView={() => send('clickOnSearch')}
        />
      </RenderIf>
    </div>
  );
}

export default Chat;
