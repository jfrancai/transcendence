import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatSocket } from './chat.interface';

@Injectable()
export default class ChatService {
  public io: Server;

  setIoServer(server: Server) {
    this.io = server;
    this.io.use((socket: ChatSocket, next) => {
      const { username } = socket.handshake.auth;
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket.username = username;
      return next();
    });
  }

  handleConnection(socket: ChatSocket, ...args: any[]) {
    const users: { userID: string; username: string }[] = [];
    this.io.of('/').sockets.forEach((sckt: ChatSocket, id: string) => {
      users.push({
        userID: id,
        username: sckt.username
      });
    });
    socket.emit('users', users);
    socket.broadcast.emit('user connected', {
      userID: socket.id,
      username: socket.username
    });
  }

  handlePrivateMessage(to: string, content: string, socket: ChatSocket) {
    socket.to(to).emit('private message', {
      content,
      from: socket.id
    });
  }
}
