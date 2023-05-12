import { Test, TestingModule } from '@nestjs/testing';
import { SuperHeroController } from './super-hero.controller';

describe('SuperHeroController', () => {
  let controller: SuperHeroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperHeroController],
    }).compile();

    controller = module.get<SuperHeroController>(SuperHeroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
