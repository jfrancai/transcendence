import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import ChatHeader from '../../components/chat/ChatHeader/ChatHeader';
import RenderIf from '../../components/chat/RenderIf/RenderIf';
import { chatMachine } from '../../machines/chatMachine';
import MenuSelector from '../../components/chat/MenuSelector/MenuSelector';
import { SocketContextProvider, useSocketContext } from '../../contexts/socket';
import { useSession } from '../../utils/hooks/useSession';
import { PrivateMessage } from '../../components/chat/PrivateMessage/PrivateMessage';
import { Channel } from '../../components/chat/Channel/Channel';

function ChatWrapped() {
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
  const isJoinChannelView = state.matches({ opened: 'joinChannelView' });
  const isChannelSettings = state.matches({ opened: 'channelSettings' });
  const isChannelConfigView = state.matches({ opened: 'channelConfigView' });
  const isCreateORJoinChannelView = state.matches({
    opened: 'createORJoinChannelView'
  });
  const isInviteChannelView = state.matches({
    opened: 'inviteChannelView'
  });

  const isConversationView = state.matches({ opened: 'conversationView' });

  const chatHeaderStyle = isChatClosed
    ? 'static bg-pong-blue-300'
    : ' absolute backdrop-blur';
  return (
    <div className="absolute bottom-2 right-2 z-30 w-[336px] overflow-hidden rounded-3xl bg-pong-blue-300">
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
      <Channel
        toggleChannelView={() => send('clickOnChannel')}
        toggleInviteChannel={() => send('inviteChannel')}
        toggleChannelSettings={() => send('selectChannel')}
        toggleCreateChannelView={() => send('addChannel')}
        createChannel={() => send('createChannel')}
        joinChannel={() => send('joinChannel')}
        updateChannel={() => send('updateChannel')}
        isCreateORJoinChannelView={isCreateORJoinChannelView}
        isChannelView={isChannelView}
        isChannelSettings={isChannelSettings}
        isChannelNameView={isChannelNameView}
        isJoinChannelView={isJoinChannelView}
        isInviteChannelView={isInviteChannelView}
        isChannelConfigView={isChannelConfigView}
      />
      <RenderIf some={[isSearchView]}>
        <p className="text-white">searchView</p>
      </RenderIf>
      <RenderIf some={[isNotificationView]}>
        <p className="text-white">notificationView</p>
      </RenderIf>

      <RenderIf
        some={[
          isMessageView,
          isChannelSettings,
          isSearchView,
          isNotificationView,
          isChannelSettings
        ]}
      >
        <MenuSelector
          isMessageView={isMessageView}
          isChannelView={isChannelView}
          isChannelSettings={isChannelSettings}
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

function Chat() {
  return (
    <SocketContextProvider>
      <ChatWrapped />
    </SocketContextProvider>
  );
}

export default Chat;
