import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/socket';

interface Position {
  x: number;
  y: number;
}

interface Paddle extends Position {
  width: number;
  height: number;
}

interface Canva {
  width: number;
  height: number;
}

interface Ball extends Position {
  radius: number;
}

interface GameState {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  canva: Canva;
  scorePlayer1: number;
  scorePlayer2: number;
  maxScore: number;
}

export function useGameState(): { gameState: GameState | undefined } {
  const { socket } = useSocketContext();
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    const onGameState = (state: GameState) => {
      const newState: GameState = state;
      const newWidth = window.innerWidth - 100;
      const scaleFactor = newWidth / state.canva.width;
      const newHeight = state.canva.height * scaleFactor;
      newState.canva.width = newWidth;
      newState.canva.height = newHeight;
      setGameState(newState);
    };

    socket.on('gameState', onGameState);

    return () => {
      socket.off('gameState', onGameState);
    };
  }, [socket, gameState]);

  return { gameState };
}
