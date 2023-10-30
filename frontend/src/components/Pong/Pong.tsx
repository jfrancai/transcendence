import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { useDraw } from '../../utils/hooks/useDraw';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from './Canvas';
import { usePlayerReady } from '../../utils/hooks/usePlayersJoinedParty';
import { PongStateContextProvider } from '../../contexts/pongState';
import { WaitingButton } from './WaitingButton';
import { ModeButtons } from './ModeButton';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { useJoinParty } from '../../utils/hooks/useJoinParty';
import { useGameOver } from '../../utils/hooks/useGameOver';
import { ReadyButton } from './ReadyButton';
import { PlayAgainButton } from './PlayAgainButton';
import { useConnection } from '../../utils/hooks/useConnection';

export function WrappedPong() {
  const { socket } = useSocketContext();
  const { drawClassicGame, width, height } = useDraw();
  useGameOver();
  useJoinParty();
  useGameStarted();
  usePaddle();
  usePlayerReady();
  useConnection();

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
      <PlayAgainButton />
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
    <>
      <PongStateContextProvider>
        <WrappedPong />
      </PongStateContextProvider>
      <Outlet />
    </>
  );
}
