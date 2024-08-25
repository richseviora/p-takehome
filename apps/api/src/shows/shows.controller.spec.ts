import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';

const moduleMocker = new ModuleMocker(global);

describe('ShowsController', () => {
  let controller: ShowsController;
  let showRepositoryMock: any;

  beforeEach(async () => {
    showRepositoryMock = {
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowsController],
      providers: [ShowsService],
    })
      .useMocker((token) => {
        if (token === 'SHOW_REPOSITORY') {
          return showRepositoryMock;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<ShowsController>(ShowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
