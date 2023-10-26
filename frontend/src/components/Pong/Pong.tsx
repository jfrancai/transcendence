import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { useDraw } from '../../utils/hooks/useDraw';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from './Canvas';
import { usePlayerReady } from '../../utils/hooks/usePlayersJoinedParty';
import { useJoinParty } from '../../utils/hooks/useJoinParty';
import { useGameOver } from '../../utils/hooks/useGameOver';
import {
  PongStateContextProvider,
  usePongStateContext
} from '../../contexts/pongState';
import { WaitingButton } from './WaitingButton';
import { ModeButtons } from './ModeButton';
import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';

interface GameButtonProps {
  gameMode: string;
  handleJoinWaitingRoom: () => void;
}

export function GameButton({
  gameMode,
  handleJoinWaitingRoom
}: GameButtonProps) {
  const { socket } = useSocketContext();
  const { isGameOver } = useGameOver();
  const { isGameStarted } = useGameStarted();
  const handlePlayerReady = () => {
    socket.emit('playerReady');
  };

  const handlePlayAgain = () => {
    socket.emit('playAgain');
  };

  const classicHandler = () => {
    if (isGameOver) {
      handlePlayAgain();
    }
    if (hasJoinParty) {
      handlePlayerReady();
    } else {
      handleJoinWaitingRoom();
    }
  };

  useEffect(() => {
    if (isGameOver) {
      setHasText('Play again !');
    } else if (hasJoinParty) {
      setHasText('Waiting...');
      if (hasJoinParty) {
        if (isPlayerReady) {
          setHasText('You are Ready !');
        } else if (!isPlayerReady) {
          setHasText('Ready');
        }
      }
    } else {
      setHasText(`Play ${gameMode} mode`);
    }
  }, [gameMode, isPlayerReady, hasJoinParty, isGameOver]);

  return (
    <button
      type="button"
      onClick={classicHandler}
      className={`${isGameStarted ? 'hidden' : ''} ${
        isGameOver ? 'mt-60' : ''
      } rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600`}
    >
      {hasText}
    </button>
  );
}

export function ReadyButton() {
  const { isPlayerReady } = usePlayerReady();
  const {
    SET_READY,
    SET_NOTREADY,
    isClassicModePartyLobby,
    isSpeedModePartyLobby
  } = usePongStateContext();

  return (
    <RenderIf some={[isClassicModePartyLobby, isSpeedModePartyLobby]}>
      <PongDiv>
        <BluePongButton onClick={isPlayerReady ? SET_NOTREADY : SET_READY}>
          {isPlayerReady ? 'Ready' : 'Not Ready'}
        </BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}

export function WrappedPong() {
  const { socket } = useSocketContext();
  const { drawClassicGame, width, height } = useDraw();
  usePaddle();

  useEffect(() => {
    connectSocket();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <ModeButtons />
      <WaitingButton />
      <ReadyButton />
      <Canvas
        draw={drawClassicGame}
        className="flex items-center rounded-lg shadow-lg"
        width={width}
        height={height}
      />
    </div>
  );
}

export default function Pong() {
  return (
    <PongStateContextProvider>
      <WrappedPong />
    </PongStateContextProvider>
  );
}
