import { io } from 'socket.io-client';
import { PongSocket } from '../hooks/useStatus.interfaces';

const devURL = 'http://localhost:3000';
const URL = process.env.NODE_ENV === 'prod' ? devURL : devURL;

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
}) as PongSocket;
