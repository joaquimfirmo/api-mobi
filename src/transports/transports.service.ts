import { Injectable, Logger } from '@nestjs/common';
import { TransportsRepository } from './transports.repository';
import { TransportFilters } from './types/transports.types';
@Injectable()
export class TransportsService {
  constructor(
    private readonly logger: Logger,
    private readonly transportsRepository: TransportsRepository,
  ) {}
  async findAll(filters: TransportFilters, page: number, limit: number) {
    this.logger.log(
      `Fetching transports with filters: ${JSON.stringify(filters)}`,
    );

    const result = await this.transportsRepository.findAll(
      filters,
      page,
      limit,
    );
    return result;
  }
}
