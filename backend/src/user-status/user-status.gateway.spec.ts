import { Test, TestingModule } from '@nestjs/testing';
import { UserStatusGateway } from './user-status.gateway';

describe('UserStatusGateway', () => {
  let gateway: UserStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatusGateway],
    }).compile();

    gateway = module.get<UserStatusGateway>(UserStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
