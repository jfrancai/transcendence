import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import ChatFeed from '../../components/chat/ChatFeed/ChatFeed';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import SendMessageInput from '../../components/chat/SendMessageInput/SendMessageInput';
import { chatMachine } from '../../machines/chatMachine';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { ContactListFeed } from '../../components/chat/ContactListFeed.tsx/ContactListFeed';
import { Scrollable } from '../../components/chat/Scrollable/Scrollable';
import { CreateChannelView } from '../../components/chat/CreateChannelView/CreateChannelView';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';
import { ChannelCarrousel } from '../../components/chat/ChannelCarrousel/ChannelCarrousel';
import { useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';

interface PrivateMessageProps {
  isMessageView: boolean;
  isConversationView: boolean;
  toggleConversationView: () => any;
}

export function PrivateMessage({
  isMessageView,
  isConversationView,
  toggleConversationView
}: PrivateMessageProps) {
  const [userID, setUserID] = useState<string>('');

  return (
    <>
      <RenderIf some={[isConversationView]}>
        <ChatFeed userID={userID} />
      </RenderIf>
      <RenderIf some={[isMessageView]}>
        <ContactListFeed
          setUserID={setUserID}
          toggleConversationView={toggleConversationView}
        />
      </RenderIf>
      <RenderIf some={[isConversationView]}>
        <SendMessageInput receiverID={userID} />
      </RenderIf>
    </>
  );
}
function Chat() {
  const { socket } = useSocketContext();
  const [state, send] = useMachine(chatMachine);

  useSession((data) => {
    socket.userID = data.userID;
  });

  useEffect(() => {
    socket.emit('session');
  }, [socket]);

  const isChatClosed = state.matches('closed');
  const isMessageView = state.matches({ opened: 'messageView' });
  const isChannelView = state.matches({ opened: 'channelView' });
  const isSearchView = state.matches({ opened: 'searchView' });
  const isNotificationView = state.matches({ opened: 'notificationView' });
  const isChannelNameView = state.matches({ opened: 'channelNameView' });
  const isCreateORJoinChannelView = state.matches({
    opened: 'createORJoinChannelView'
  });
  const isInviteChannelView = state.matches({
    opened: 'inviteChannelView'
  });

  const isConversationView = state.matches({ opened: 'conversationView' });
  const isChanConversationView = state.matches({
    opened: 'channelConversationView'
  });

  const chatHeaderStyle = isChatClosed
    ? 'static bg-pong-blue-300'
    : ' absolute backdrop-blur';
  return (
    <div className="absolute bottom-2 right-2 z-30 w-fit overflow-hidden rounded-3xl bg-pong-blue-300">
      <ChatHeader
        className={`z-40 ${chatHeaderStyle}`}
        isChatClosed={isChatClosed}
        handleClick={{
          toggleArrow: () => send(isChatClosed ? 'OPEN' : 'CLOSE'),
          changeView: () => send({ type: 'selectHeader' })
        }}
      />

      <PrivateMessage
        toggleConversationView={() => send('selectContact')}
        isConversationView={isConversationView}
        isMessageView={isMessageView}
      />
      <RenderIf some={[isChannelView]}>
        <div className="flex flex-row">
          <ChannelCarrousel
            toggleCreateChannelView={() => send('addChannel')}
          />
          <div className="w-full" />
        </div>
      </RenderIf>
      <RenderIf some={[isCreateORJoinChannelView]}>
        <Scrollable>
          <div className="flex w-full flex-col items-center justify-center gap-10 pt-28">
            <p className="text-2xl font-bold text-pong-white">
              Create your Channel
            </p>

            <PrimaryButton onClick={() => send('createChannel')}>
              Create my own channel
            </PrimaryButton>
          </div>
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
      <RenderIf some={[isChannelNameView]}>
        <Scrollable>
          <CreateChannelView
            toggleInviteChannel={() => send('inviteChannel')}
          />
        </Scrollable>
        <div className="h-14 w-[336px]" />
      </RenderIf>
      <RenderIf some={[isInviteChannelView]}>coucou</RenderIf>
      <RenderIf some={[isSearchView]}>
        <p className="text-white">searchView</p>
      </RenderIf>
      <RenderIf some={[isNotificationView]}>
        <p className="text-white">notificationView</p>
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
