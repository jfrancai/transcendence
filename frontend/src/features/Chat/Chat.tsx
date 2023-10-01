import { AiOutlinePlusCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { useMachine } from '@xstate/react';
import { useEffect, useState } from 'react';
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
import ProfilePicture from '../../components/chat/ProfilePicture/ProfilePicture';
import SecondaryButton from '../../components/chat/ProfileButton/ProfileButton';

export function SelectChannelType() {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-1 flex gap-3">
      <SecondaryButton
        onClick={() => setActive(0)}
        disabled={active !== 0}
        span="Public"
      />
      <SecondaryButton
        onClick={() => setActive(1)}
        disabled={active !== 1}
        span="Private"
      />
      <SecondaryButton
        onClick={() => setActive(2)}
        disabled={active !== 2}
        span="Protected"
      />
    </div>
  );
}

export function CreateChannelView() {
  const [channelName, setChannelName] = useState('');
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 pt-28">
      <p className="text-2xl font-bold text-pong-white">Create your Channel</p>
      <div className="flex flex-col w-full px-5 ">
        <p className="block text-sm font-bold text-pong-white">
          CHANNEL PICTURE
        </p>
        <label htmlFor="UploadChannelImage" className="rounded text-[50px] flex justify-center mt-2 border border-dashed border-pong-white">
          <input id="UploadChannelImage" type="file" className="hidden" />
          <AiOutlineCloudUpload className="bg-pong-blue-500 rounded-full p-1 text-pong-blue-100 my-4 cursor-pointer" />
        </label>
      </div>
      <div className="flex flex-col w-full px-5">
        <label htmlFor="ChannelName">
          <p className="block text-sm font-bold text-pong-white">
            CHANNEL NAME
          </p>
          <input
            type="email"
            id="ChannelName"
            className="mt-1 w-full rounded-md border border-pong-blue-100 bg-pong-blue-500 p-1 text-base text-pong-white"
            defaultValue={`${socket.username}'s channel`}
            onChange={(e) => setChannelName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <p className="block text-sm font-bold text-pong-white">CHANNEL TYPE</p>
        <SelectChannelType />
      </div>
      <button
        type="button"
        className="flex rounded-xl bg-pong-purple-100 px-5 py-2 text-pong-white hover:bg-pong-purple-200"
      >
        Create Channel
      </button>
    </div>
  );
}

interface ChannelCarrouselProps {
  toggleCreateChannelView: () => any;
}

export function ChannelCarrousel({
  toggleCreateChannelView
}: ChannelCarrouselProps) {
  return (
    <Scrollable>
      <div className="mt-28 w-16 rounded-2xl bg-pong-blue-500 pt-2">
        <Scrollable>
          <div className="flex flex-col items-center justify-center gap-3">
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <ProfilePicture size="s" url="starwatcher.jpg" />
            <div className="">
              <button type="button" onClick={toggleCreateChannelView}>
                <AiOutlinePlusCircle className="h-[50px] w-[50px] rounded-2xl text-pong-blue-100 hover:bg-pong-blue-100 hover:text-pong-blue-500" />
              </button>
            </div>
          </div>
        </Scrollable>
      </div>
    </Scrollable>
  );
}

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
  const isCreateORJoinChannelView = state.matches({
    opened: 'createORJoinChannelView'
  });

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

  const chatHeaderStyle = isChatClosed
    ? 'static bg-pong-blue-300'
    : ' absolute backdrop-blur';
  return (
    <div className="absolute bottom-2 right-2 z-30 w-fit overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader
        className={`z-40 ${chatHeaderStyle}`}
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
        />
      </RenderIf>
      <RenderIf some={[isChannelView]}>
        <div className="flex flex-row">
          <ChannelCarrousel
            toggleCreateChannelView={() => send('addChannel')}
          />
          <div className="w-full">
            <ContactListFeed
              contactList={status.contactList.filter(
                (user) => user.userID !== socket.userID
              )}
              toggleConversationView={() => send('selectContact')}
              setContact={setContact}
            />
          </div>
        </div>
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
        <Scrollable>
          <CreateChannelView />
        </Scrollable>
        <div className="h-14 w-[336px]" />
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
