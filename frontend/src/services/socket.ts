import { io, Socket } from 'socket.io-client';

interface PongSocket extends Socket {
  userID: string;
  username: string;
}

const devURL = 'http://localhost:3000';
const URL = process.env.NODE_ENV === 'prod' ? devURL : devURL;

const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
}) as PongSocket;

socket.on('connect', () => {
  /* eslint-disable */
  console.log('connected');
  /* eslint-enable */
});

socket.on('disconnect', () => {
  /* eslint-disable */
  console.log('disconnected');
  /* eslint-enable */
});

socket.onAny((event, ...args) => {
  /* eslint-disable */
  console.log(event, args);
  /* eslint-enable */
});

export default socket;
