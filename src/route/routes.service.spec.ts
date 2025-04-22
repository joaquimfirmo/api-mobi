import { Test, TestingModule } from '@nestjs/testing';
import {
  Logger,
  Scope,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { RoutesService } from './routes.service';
import { RoutesRepository } from './routes.repository';
import { Routes } from '../common/database/types';
import { RouteMapper } from './mapper/route.mapper';
import { Route } from './entities/route.entity';

describe('RoutesService', () => {
  let service: RoutesService;
  let routesRepository: RoutesRepository;
  let logger: Logger;

  const mockRoutes = [
    {
      id: '1',
      nome: 'Rota 1',
      id_cidade_origem: 'Cidade A',
      id_cidade_destino: 'Cidade B',
      distancia: 100,
      tempo_estimado: '01:00',
      local: 'Local A',
      via_principal: 'Via Principal A',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutesService,
        {
          provide: RoutesRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findRouteByName: jest.fn(),
            findRouteByCities: jest.fn(),
          },
        },
        {
          provide: Logger,
          scope: Scope.TRANSIENT,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoutesService>(RoutesService);
    routesRepository = module.get<RoutesRepository>(RoutesRepository);
    logger = module.get<Logger>(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call routesRepository.findAll with correct parameters', async () => {
      const filters: Partial<Routes> = { id: '1' };
      const page = 1;
      const limit = 10;

      await service.findAll(filters, page, limit);

      expect(routesRepository.findAll).toHaveBeenCalledWith(
        RouteMapper.toPersistence(filters),
        page,
        limit,
      );
    });

    it('should handle errors correctly', async () => {
      const filters: Partial<Routes> = { id: '1' };
      const page = 1;
      const limit = 10;
      const errorMessage = 'Database error';
      jest
        .spyOn(routesRepository, 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll(filters, page, limit)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao buscar rotas com os filtros: ${JSON.stringify(filters)}`,
        new Error(errorMessage),
      );
    });
  });

  describe('findOne', () => {
    it('should call routesRepository.findOne with correct parameters', async () => {
      const id = '1';

      jest
        .spyOn(routesRepository, 'findById')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));
      const result = await service.findOne(id);

      expect(routesRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
    });

    it('should handle errors correctly', async () => {
      const id = '1';
      const errorMessage = 'Database error';
      jest
        .spyOn(routesRepository, 'findById')
        .mockRejectedValue(new Error(errorMessage));

      const handleErrorSpy = jest.spyOn(service as any, 'handleError');

      await expect(service.findOne(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(handleErrorSpy).toHaveBeenCalledWith(
        `Erro ao buscar rota com o ID:${id}`,
        new Error(errorMessage),
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao buscar rota com o ID:${id}`,
        new Error(errorMessage),
      );
    });

    it('should throw NotFoundException if route is not found', async () => {
      const id = '1';

      const handleErrorSpy = jest.spyOn(service as any, 'handleError');
      jest.spyOn(routesRepository, 'findById').mockResolvedValue(null);
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(handleErrorSpy).toHaveBeenCalledWith(
        `Erro ao buscar rota com o ID:${id}`,
        new NotFoundException(`Rota com o ID:${id} não encontrada`),
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao buscar rota com o ID:${id}`,
        new NotFoundException(`Rota com o ID:${id} não encontrada`),
      );
    });
  });

  describe('create', () => {
    it('should create a route and call routesRepository.create with the correct parameters', async () => {
      jest.spyOn(routesRepository, 'findRouteByName').mockResolvedValue(null);
      jest.spyOn(routesRepository, 'findRouteByCities').mockResolvedValue(null);
      const createRouteDTO = {
        nome: 'Rota 1',
        idCidadeOrigem: 'Cidade A',
        idCidadeDestino: 'Cidade B',
        distancia: 100,
        tempoEstimado: '01:00',
        localOrigem: 'Local A',
        viaPrincipal: 'Via Principal A',
      };

      jest
        .spyOn(routesRepository, 'create')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      const ensureRouteDoesNotExistSpy = jest.spyOn(
        service as any,
        'ensureRouteDoesNotExist',
      );

      const saveRouteSpy = jest.spyOn(service as any, 'saveRoute');

      const result = await service.create(createRouteDTO);

      expect(ensureRouteDoesNotExistSpy).toHaveBeenCalledWith(createRouteDTO);

      expect(routesRepository.findRouteByName).toHaveBeenCalledWith(
        createRouteDTO.nome,
      );
      expect(routesRepository.findRouteByCities).toHaveBeenCalledWith(
        createRouteDTO.idCidadeOrigem,
        createRouteDTO.idCidadeDestino,
      );

      expect(saveRouteSpy).toHaveBeenCalledWith(expect.any(Route));

      expect(routesRepository.create).toHaveBeenCalledWith({
        id: expect.any(String),
        nome: createRouteDTO.nome,
        id_cidade_origem: createRouteDTO.idCidadeOrigem,
        id_cidade_destino: createRouteDTO.idCidadeDestino,
        distancia: createRouteDTO.distancia,
        tempo_estimado: createRouteDTO.tempoEstimado,
        local: createRouteDTO.localOrigem,
        via_principal: createRouteDTO.viaPrincipal,
        created_at: null,
        updated_at: null,
      });

      expect(logger.log).toHaveBeenCalledWith(
        `Criando rota: ${createRouteDTO.nome}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Rota criada: ${JSON.stringify(result)}`,
      );
      expect(logger.log).toHaveBeenCalledTimes(2);
      expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
    });

    it('should handle errors correctly', async () => {
      const createRouteDTO = {
        nome: 'Rota 1',
        idCidadeOrigem: 'Cidade A',
        idCidadeDestino: 'Cidade B',
        distancia: 100,
        tempoEstimado: '01:00',
        localOrigem: 'Local A',
        viaPrincipal: 'Via Principal A',
      };

      const errorMessage = 'Database error';
      jest
        .spyOn(routesRepository, 'create')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.create(createRouteDTO)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao salvar rota com`,
        new Error(errorMessage),
      );
    });
  });

  describe('update', () => {
    it('should update a route and call routesRepository.update with the correct parameters', async () => {
      const id = '1';
      const updateRouteDTO = {
        nome: 'Rota Atualizada',
        idCidadeOrigem: 'Cidade Atualizada A',
        idCidadeDestino: 'Cidade Atualizada B',
        distancia: 200,
        tempoEstimado: '02:00',
        localOrigem: 'Local Atualizado A',
        viaPrincipal: 'Via Principal Atualizada',
      };

      jest
        .spyOn(routesRepository, 'findById')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      jest
        .spyOn(routesRepository, 'update')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      const saveUpdatedRouteSpy = jest.spyOn(
        service as any,
        'saveUpdatedRoute',
      );

      const validateUpdatePayloadSpy = jest.spyOn(
        service as any,
        'validateUpdatePayload',
      );
      validateUpdatePayloadSpy.mockReturnValue(undefined);

      const result = await service.update(id, updateRouteDTO);

      expect(validateUpdatePayloadSpy).toHaveBeenCalledWith(updateRouteDTO);
      expect(routesRepository.findById).toHaveBeenCalledWith(id);
      expect(saveUpdatedRouteSpy).toHaveBeenCalledWith(
        mockRoutes[0].id,
        updateRouteDTO,
      );
      expect(routesRepository.update).toHaveBeenCalledWith(
        id,
        RouteMapper.toPersistence(updateRouteDTO),
      );
      expect(result).toEqual(RouteMapper.toDomain(mockRoutes[0]));
      expect(logger.log).toHaveBeenCalledWith(
        `Dados para atualização da rota: ${JSON.stringify(updateRouteDTO)}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `Rota atualizadoa: ${JSON.stringify(result)}`,
      );
    });

    it('should handle errors correctly', async () => {
      const id = '1';
      const updateRouteDTO = {
        nome: 'Rota Atualizada',
        idCidadeOrigem: 'Cidade Atualizada A',
        idCidadeDestino: 'Cidade Atualizada B',
        distancia: 200,
        tempoEstimado: '02:00',
        localOrigem: 'Local Atualizado A',
        viaPrincipal: 'Via Principal Atualizada',
      };

      jest
        .spyOn(routesRepository, 'findById')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));
      const errorMessage = 'Database error';
      jest
        .spyOn(routesRepository, 'update')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.update(id, updateRouteDTO)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao atualizar rota com o ID: ${id}`,
        new Error(errorMessage),
      );
    });
  });

  describe('remove', () => {
    it('should remove a route and call routesRepository.delete with the correct parameters', async () => {
      const id = '1';
      const getRouteByIdSpy = jest
        .spyOn(service as any, 'getRouteById')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      jest.spyOn(routesRepository, 'delete');

      await service.remove(id);
      expect(getRouteByIdSpy).toHaveBeenCalledWith(id);
      expect(routesRepository.delete).toHaveBeenCalledWith(mockRoutes[0].id);
      expect(logger.log).toHaveBeenCalledWith(
        `Rota com o ID:${id} excluída com sucesso`,
      );
    });

    it('should handle errors correctly', async () => {
      const id = '1';
      const errorMessage = 'Database error';

      jest
        .spyOn(service as any, 'getRouteById')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));
      jest
        .spyOn(routesRepository, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      await expect(service.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(
        `Erro ao excluir rota com o ID:${id}`,
        new Error(errorMessage),
      );
    });
  });

  describe('handleError', () => {
    it('should log the error and throw an InternalServerErrorException', () => {
      const message = 'Test error';
      const error = new Error('Database error');

      expect(() => service['handleError'](message, error)).toThrow(
        InternalServerErrorException,
      );

      expect(logger.error).toHaveBeenCalledWith(message, error);
    });
    it('should log the error and throw a NotFoundException', () => {
      const message = 'Test error';
      const error = new NotFoundException('Rota não encontrada');

      expect(() => service['handleError'](message, error)).toThrow(
        NotFoundException,
      );

      expect(logger.error).toHaveBeenCalledWith(message, error);
    });
  });

  describe('validateUpdatePayload', () => {
    it('should not throw an error if the payload contains valid data', () => {
      const updateRouteDTO = {
        nome: 'Rota Atualizada',
        idCidadeOrigem: 'Cidade Atualizada A',
        idCidadeDestino: 'Cidade Atualizada B',
        distancia: 200,
        tempoEstimado: '02:00',
        localOrigem: 'Local Atualizado A',
        viaPrincipal: 'Via Principal Atualizada',
      };

      expect(() =>
        service['validateUpdatePayload'](updateRouteDTO),
      ).not.toThrow();
    });

    it('should throw a BadRequestException if the payload is empty', () => {
      const updateRouteDTO = {};
      expect(() => service['validateUpdatePayload'](updateRouteDTO)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('ensureRouteDoesNotExist', () => {
    it('should throw a BadRequestException if the route already exists', async () => {
      const createRouteDTO = {
        nome: 'Rota 1',
        idCidadeOrigem: 'Cidade A',
        idCidadeDestino: 'Cidade B',
        distancia: 100,
        tempoEstimado: '01:00',
        localOrigem: 'Local A',
        viaPrincipal: 'Via Principal A',
      };

      jest
        .spyOn(routesRepository, 'findRouteByName')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      jest
        .spyOn(routesRepository, 'findRouteByCities')
        .mockResolvedValue(RouteMapper.toDomain(mockRoutes[0]));

      await expect(
        service['ensureRouteDoesNotExist'](createRouteDTO),
      ).rejects.toThrow(BadRequestException);

      expect(logger.warn).toHaveBeenCalledWith(
        `Falha na criação da rota: Já existe uma rota com o nome ${createRouteDTO.nome} ou com os Ids das cidades de origem:${createRouteDTO.idCidadeOrigem} e destino ${createRouteDTO.idCidadeDestino}, informados`,
      );
    });
  });
});
