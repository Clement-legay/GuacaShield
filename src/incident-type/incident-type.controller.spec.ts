import { Test, TestingModule } from '@nestjs/testing';
import { IncidentTypeController } from './incident-type.controller';

describe('IncidentTypeController', () => {
  let controller: IncidentTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentTypeController],
    }).compile();

    controller = module.get<IncidentTypeController>(IncidentTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
