import { Test, TestingModule } from '@nestjs/testing';
import { RemoveService } from './remove.service';

describe('RemoveService', () => {
  let service: RemoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoveService],
    }).compile();

    service = module.get<RemoveService>(RemoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
