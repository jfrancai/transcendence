import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ClassicWaitingRoom } from './waiting-room/waiting-room';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService, ClassicWaitingRoom]
})
export class PongModule {}
