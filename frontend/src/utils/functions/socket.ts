import { io } from 'socket.io-client';
import jwt_decode from 'jwt-decode';
import { PongSocket } from '../hooks/useStatus.interfaces';

interface DecodedToken {
  username: string;
  email: string;
  iat: string;
  exp: string;
}

const devURL = 'http://localhost:3000';
const URL = process.env.NODE_ENV === 'prod' ? devURL : devURL;

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
}) as PongSocket;

export const connectSocket = () => {
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    const decodedToken: DecodedToken = jwt_decode(jwt!);
    socket.auth = {
      token: jwt
    };
    socket.username = decodedToken.username;
    socket.connect();
  }
};
export const disconnectSocket = () => socket.disconnect();

socket.onAny((event, ...args) => {
  /* eslint-disable */
  console.log(event, args);
  /* eslint-enable */
});
