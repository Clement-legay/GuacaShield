import { Test, TestingModule } from '@nestjs/testing';
import { SuperHeroService } from './super-hero.service';

describe('SuperHeroService', () => {
  let service: SuperHeroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperHeroService],
    }).compile();

    service = module.get<SuperHeroService>(SuperHeroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
