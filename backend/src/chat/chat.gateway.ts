import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import Config, { Env } from '../config/configuration';

function webSocketOptions() {
  const config = Config();
  if (config.env === Env.Dev) {
    return {
      cors: {
        origin: 'http://localhost:5173',
        transports: ['websocket', 'polling']
      }
    };
  }
  return {};
}

@WebSocketGateway(Config().port, webSocketOptions())
export default class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Hello world !');
    return 'Hello world!';
  }
}
