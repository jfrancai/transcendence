import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import socket from '../../services/socket';
import ChatFeed from '../../components/chat/ChatFeed/ChatFeed';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import SendMessageInput from '../../components/chat/SendMessageInput/SendMessageInput';
import { Contact, useStatus } from '../../utils/hooks/useStatus';
import { useContact } from '../../utils/hooks/useContact';
import { chatMachine } from '../../machines/chatMachine';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { ContactListFeed } from '../../components/chat/ContactListFeed.tsx/ContactListFeed';
import { Scrollable } from '../../components/chat/Scrollable/Scrollable';

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
    <div className="absolute bottom-2 right-2 z-30 w-fit overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader
        className={`z-40 ${
          isChatClosed ? 'static bg-pong-blue-300' : ' absolute backdrop-blur'
        }`}
        isConnected={status.isConnected}
        isChatClosed={isChatClosed}
        handleClick={{
          toggleArrow: toggleChat,
          changeView: () => send({ type: 'selectHeader' })
        }}
      />
      <RenderIf some={[isConversationView]}>
        <ChatFeed contact={contact} isConnected={status.isConnected} />
      </RenderIf>
      <RenderIf some={[isMessageView]}>
        <ContactListFeed
          contactList={status.contactList.filter(
            (user) => user.userID !== socket.userID
          )}
          toggleConversationView={() => send('selectContact')}
          setContact={setContact}
          isChatClosed={isChatClosed}
        />
      </RenderIf>
      <RenderIf some={[isChannelView]}>
        <div className="flex flex-row">
          <Scrollable>
            <div className="mt-24">
              <div className="flex text-white">toto</div>
              <div className="flex text-white">toto</div>
              <div className="flex text-white">toto</div>
              <div className="flex text-white">toto</div>
              <div className="flex text-white">toto</div>
            </div>
          </Scrollable>
          <div className="w-full">
            <ContactListFeed
              contactList={status.contactList.filter(
                (user) => user.userID !== socket.userID
              )}
              toggleConversationView={() => send('selectContact')}
              setContact={setContact}
              isChatClosed={isChatClosed}
            />
          </div>
        </div>
      </RenderIf>
      <RenderIf some={[isSearchView]}>
        <p className="text-white">searchView</p>
      </RenderIf>
      <RenderIf some={[isNotificationView]}>
        <p className="text-white">notificationView</p>
      </RenderIf>

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
