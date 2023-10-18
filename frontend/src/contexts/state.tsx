import { useMachine } from '@xstate/react';
import { createContext, useContext, useMemo } from 'react';
import { chatMachine } from '../machines/chatMachine';

interface State {
  isChatClosed: boolean;
  isMessageView: boolean;
  isChannelView: boolean;
  isSearchView: boolean;
  isNotificationView: boolean;
  isChannelNameView: boolean;
  isJoinChannelView: boolean;
  isChannelSettings: boolean;
  isChannelConfigView: boolean;
  isCreateORJoinChannelView: boolean;
  isInviteChannelView: boolean;
  isConversationView: boolean;
  toggleConversationView: () => any;
  toggleChannelView: () => any;
  toggleInviteChannel: () => any;
  toggleChannelSettings: () => any;
  toggleCreateChannelView: () => any;
  createChannel: () => any;
  joinChannel: () => any;
  updateChannel: () => any;
  toggleMessageView: () => any;
  toggleNotificationView: () => any;
  toggleSearchView: () => any;
  toggleArrow: () => any;
  changeView: () => any;
}

const StateContext = createContext<State | null>(null);

interface StateContextProviderProps {
  children: React.ReactNode;
}

export function StateContextProvider({ children }: StateContextProviderProps) {
  const [state, send] = useMachine(chatMachine);
  const stateProviderValue = useMemo(
    (): State => ({
      isChatClosed: state.matches('closed'),
      isMessageView: state.matches({ opened: 'messageView' }),
      isChannelView: state.matches({ opened: 'channelView' }),
      isSearchView: state.matches({ opened: 'searchView' }),
      isNotificationView: state.matches({ opened: 'notificationView' }),
      isChannelNameView: state.matches({ opened: 'channelNameView' }),
      isJoinChannelView: state.matches({ opened: 'joinChannelView' }),
      isChannelSettings: state.matches({ opened: 'channelSettings' }),
      isChannelConfigView: state.matches({ opened: 'channelConfigView' }),
      isCreateORJoinChannelView: state.matches({
        opened: 'createORJoinChannelView'
      }),
      isInviteChannelView: state.matches({
        opened: 'inviteChannelView'
      }),
      isConversationView: state.matches({ opened: 'conversationView' }),
      toggleConversationView: () => send('selectContact'),
      toggleChannelView: () => send('clickOnChannel'),
      toggleInviteChannel: () => send('inviteChannel'),
      toggleChannelSettings: () => send('selectChannel'),
      toggleCreateChannelView: () => send('addChannel'),
      createChannel: () => send('createChannel'),
      joinChannel: () => send('joinChannel'),
      updateChannel: () => send('updateChannel'),
      toggleMessageView: () => send('clickOnMessage'),
      toggleNotificationView: () => send('clickOnNotification'),
      toggleSearchView: () => send('clickOnSearch'),
      toggleArrow: () => send(state.matches('closed') ? 'OPEN' : 'CLOSE'),
      changeView: () => send('selectHeader')
    }),
    [state, send]
  );
  return (
    <StateContext.Provider value={stateProviderValue}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      'useStateContext must be used within a StateContextProvider'
    );
  }
  return context;
}
