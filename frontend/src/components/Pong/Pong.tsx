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

export default function Pong() {
  const { socket } = useSocketContext();
  const { drawClassicGame, width, height } = useDraw();
  const { isGameOver } = useGameOver();
  const { isGameStarted } = useGameStarted();
  const { isPlayerReady } = usePlayerReady();
  const { hasJoinParty } = useJoinParty();
  const { hasJoinWaitingRoom } = useJoinWaitingRoom();
  const [hasText, setHasText] = useState('Join waiting-room');
  usePaddle();

  const handleJoinWaitingRoom = () => {
    socket.emit('initialState');
    socket.emit('joinWaitingRoom');
  };

  const handlePlayerReady = () => {
    socket.emit('playerReady');
  };

  const handlePlayAgain = () => {
    socket.emit('playAgain');
  };

  const handler = () => {
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
    connectSocket();
  }, []);

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
      setHasText('Join waiting-room');
    }
  }, [hasJoinWaitingRoom, isPlayerReady, hasJoinParty, isGameOver]);

  return (
    <div className="flex h-screen items-center justify-center bg-[url('./images/background.png')] bg-cover">
      <button
        type="button"
        onClick={handler}
        className={`absolute ${isGameStarted ? 'hidden' : ''} ${
          isGameOver ? 'mt-60' : ''
        } rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600`}
      >
        {hasText}
      </button>
      <Canvas
        draw={drawClassicGame}
        className="flex items-center rounded-lg shadow-lg"
        width={width}
        height={height}
      />
    </div>
  );
}
