import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { WaitingRoom } from './waiting-room/waiting-room';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService, WaitingRoom]
})
export class PongModule {}
