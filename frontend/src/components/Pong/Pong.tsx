import { useEffect } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { useDraw } from '../../utils/hooks/useDraw';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from './Canvas';
import { usePlayerReady } from '../../utils/hooks/usePlayersJoinedParty';
import {
  PongStateContextProvider,
  usePongStateContext
} from '../../contexts/pongState';
import { WaitingButton } from './WaitingButton';
import { ModeButtons } from './ModeButton';
import { BluePongButton } from './PongButton';
import { PongDiv } from './PongDiv';
import RenderIf from '../chat/RenderIf/RenderIf';
import { useConnection } from '../../utils/hooks/useConnection';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { useJoinParty } from '../../utils/hooks/useJoinParty';

export function ReadyButton() {
  const { socket } = useSocketContext();
  const { isSpeedNotReady, isClassicNotReady, isClassicReady, isSpeedReady } =
    usePongStateContext();

  return (
    <RenderIf
      some={[isSpeedReady, isClassicReady, isClassicNotReady, isSpeedNotReady]}
    >
      <PongDiv>
        <BluePongButton
          onClick={
            isSpeedReady || isClassicReady
              ? () => socket.emit('playerNotReady')
              : () => socket.emit('playerReady')
          }
        >
          {isSpeedReady || isClassicReady ? 'Ready' : 'Not Ready'}
        </BluePongButton>
      </PongDiv>
    </RenderIf>
  );
}

export function WrappedPong() {
  const { socket } = useSocketContext();
  const { drawClassicGame, width, height } = useDraw();
  const { pongStatus } = useConnection();
  const { send } = usePongStateContext();
  useJoinParty();
  useGameStarted();
  usePaddle();
  usePlayerReady();

  useEffect(() => {
    send(pongStatus);
  }, [send, pongStatus]);

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
