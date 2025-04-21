import { Test, TestingModule } from '@nestjs/testing';
import { AlatService } from './alat.service';

describe('AlatService', () => {
  let service: AlatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlatService],
    }).compile();

    service = module.get<AlatService>(AlatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
