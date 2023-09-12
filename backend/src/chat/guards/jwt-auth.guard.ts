import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';

function validateData(data: any) {
  if (data) {
    return true;
  }
  return false;
}

@Injectable()
export class WSJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WSJwtAuthGuard.name);

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data = context.switchToWs().getData();
    const client = context.switchToWs().getClient();
    this.logger.debug('COUUUUUUUUUUUcou');
    return validateData(data);
  }
}
