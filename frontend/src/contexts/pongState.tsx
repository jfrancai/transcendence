import { useMachine } from '@xstate/react';
import { ReactNode, createContext, useContext, useMemo } from 'react';
import { pongMachine } from '../machines/pongMachine';

interface PongState {
  isChoosingMode: boolean;
  isClassicModeWaitingRoom: boolean;
  isSpeedModeWaitingRoom: boolean;
  isClassicModePartyLobby: boolean;
  isReady: boolean;
  isNotReady: boolean;
  isClassicMatchMode: boolean;
  isClassicMatchModeEnd: boolean;
  isSpeedModePartyLobby: boolean;
  isSpeedModeMatch: boolean;
  isSpeedModeMatchEnd: boolean;
  CLASSIC_MODE: () => void;
  JOIN_PARTY_LOBBY: () => void;
  SET_READY: () => void;
  SET_NOTREADY: () => void;
  START_MATCH: () => void;
  END_MATCH: () => void;
  CHANGE_MODE: () => void;
  PLAY_AGAIN: () => void;
  SPEED_MODE: () => void;
}

const PongStateContext = createContext<PongState | null>(null);

interface PongStateContextProviderProps {
  children: ReactNode;
}

export function PongStateContextProvider({
  children
}: PongStateContextProviderProps) {
  const [state, send] = useMachine(pongMachine);
  const stateProviderValue = useMemo(
    (): PongState => ({
      isChoosingMode: state.matches('Choosing Mode'),
      isClassicModeWaitingRoom: state.matches('Classic Mode Waiting Room'),
      isSpeedModeWaitingRoom: state.matches('Speed Mode Waiting Room'),
      isClassicModePartyLobby: state.matches('Classic Mode Party Lobby'),
      isReady: state.matches('Ready'),
      isNotReady: state.matches('Not Ready'),
      isClassicMatchMode: state.matches('Classic Mode Match'),
      isClassicMatchModeEnd: state.matches('Classic Mode Match End'),
      isSpeedModePartyLobby: state.matches('Speed Mode Party Lobby'),
      isSpeedModeMatch: state.matches('Speed Mode Match'),
      isSpeedModeMatchEnd: state.matches('Speed Mode Match End'),
      CLASSIC_MODE: () => send('CLASSIC_MODE'),
      JOIN_PARTY_LOBBY: () => send('JOIN_PARTY_LOBBY'),
      SET_READY: () => send('SET_READY'),
      SET_NOTREADY: () => send('SET_NOTREADY'),
      START_MATCH: () => send('START_MATCH'),
      END_MATCH: () => send('END_MATCH'),
      CHANGE_MODE: () => send('CHANGE_MODE'),
      PLAY_AGAIN: () => send('PLAY_AGAIN'),
      SPEED_MODE: () => send('SPEED_MODE')
    }),
    [state, send]
  );
  return (
    <PongStateContext.Provider value={stateProviderValue}>
      {children}
    </PongStateContext.Provider>
  );
}

export function usePongStateContext() {
  const context = useContext(PongStateContext);
  if (!context) {
    throw new Error(
      'usePongStateContext must be used within a PongStateContextProvider'
    );
  }
  return context;
}
