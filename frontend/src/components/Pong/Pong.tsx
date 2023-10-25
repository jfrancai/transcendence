import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';
import { connectSocket } from '../../utils/functions/socket';
import { useDraw } from '../../utils/hooks/useDraw';
import { useGameStarted } from '../../utils/hooks/useStartGame';
import { usePaddle } from '../../utils/hooks/usePaddle';
import { Canvas } from './Canvas';
import { useJoinWaitingRoom } from '../../utils/hooks/useJoinWaitingRoom';
import { usePlayerReady } from '../../utils/hooks/usePlayersJoinedParty';
import { useJoinParty } from '../../utils/hooks/useJoinParty';
import { useGameOver } from '../../utils/hooks/useGameOver';
import { useConnection } from '../../utils/hooks/useConnection';

interface GameButtonProps {
  gameMode: string;
  handleJoinWaitingRoom: () => void;
}

export function GameButton({
  gameMode,
  handleJoinWaitingRoom
}: GameButtonProps) {
  const { socket } = useSocketContext();
  const [hasText, setHasText] = useState('Play Classic mode');
  const { isGameOver } = useGameOver();
  const { isGameStarted } = useGameStarted();
  const { isPlayerReady } = usePlayerReady();
  const { hasJoinParty } = useJoinParty();
  const { hasJoinWaitingRoom } = useJoinWaitingRoom();
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
    if (hasJoinWaitingRoom || hasJoinParty) {
      handlePlayerReady();
    } else {
      handleJoinWaitingRoom();
    }
  };

  useEffect(() => {
    if (isGameOver) {
      setHasText('Play again !');
    } else if (hasJoinWaitingRoom || hasJoinParty) {
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
  }, [gameMode, hasJoinWaitingRoom, isPlayerReady, hasJoinParty, isGameOver]);

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

export function Buttons() {
  const { socket } = useSocketContext();
  const { pongStatus, setPongStatus } = useConnection();
  const handleJoinClassicWaitingRoom = () => {
    socket.emit('initialState');
    socket.emit('joinClassicWaitingRoom');
    setPongStatus('waitingRoom');
  };

  const handleJoinSpeedWaitingRoom = () => {
    socket.emit('initialState');
    socket.emit('joinSpeedWaitingRoom');
    setPongStatus('waitingRoom');
  };
  return (
    <div className="absolute flex flex-col gap-5">
      {pongStatus === 'default' && (
        <GameButton
          gameMode="classic"
          handleJoinWaitingRoom={handleJoinClassicWaitingRoom}
        />
      )}
      <GameButton
        gameMode="speed"
        handleJoinWaitingRoom={handleJoinSpeedWaitingRoom}
      />
    </div>
  );
}

export default function Pong() {
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
      <Buttons />
      <Canvas
        draw={drawClassicGame}
        className="flex items-center rounded-lg shadow-lg"
        width={width}
        height={height}
      />
    </div>
  );
}
