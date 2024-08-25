import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import { ShowsService } from './shows.service';
import { showsProviders } from './shows.providers';

const moduleMocker = new ModuleMocker(global);

describe('ShowsService', () => {
  let service: ShowsService;
  let showRepositoryMock: any;

  beforeEach(async () => {
    showRepositoryMock = {
      find: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ShowsService>(ShowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
