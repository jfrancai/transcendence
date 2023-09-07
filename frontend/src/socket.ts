import { io } from 'socket.io-client';

const devURL = 'http://localhost:3000';
const URL = process.env.NODE_ENV === 'prod' ? devURL : devURL;

const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});

export default socket;
