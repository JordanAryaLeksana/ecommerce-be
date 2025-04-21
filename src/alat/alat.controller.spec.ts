import { Test, TestingModule } from '@nestjs/testing';
import { AlatController } from './alat.controller';

describe('AlatController', () => {
  let controller: AlatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlatController],
    }).compile();

    controller = module.get<AlatController>(AlatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
