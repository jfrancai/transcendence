import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { ChatSocket } from '../chat.interface';

@Catch(Error, WsException)
export class ChatFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ChatFilter.name);

  catch(exception: WsException | Error, host: ArgumentsHost) {
    this.logger.log(exception);
    const socket = host.switchToWs().getClient() as ChatSocket;
    const data = host.switchToWs().getData();
    socket.emit('error', {
      username: socket.user.username,
      data,
      ...exception
    });
  }
}

export default {};
