import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [DatabaseModule],
  providers: [PongGateway, PongService],
  exports: [PongService]
})
export class PongModule {}
