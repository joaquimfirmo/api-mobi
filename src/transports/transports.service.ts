import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransportsRepository } from './transports.repository';

@Injectable()
export class TransportsService {
  constructor(
    private readonly logger: Logger,
    private readonly transportsRepository: TransportsRepository,
  ) {}
  async findAll(filters: any, page: number, limit: number) {
    this.logger.log(
      `Fetching transports with filters: ${JSON.stringify(filters)}`,
    );

    try {
      const result = await this.transportsRepository.findAll(
        filters,
        page,
        limit,
      );
      return result;
    } catch (error) {
      this.logger.error('Error fetching transports', error);
      throw new InternalServerErrorException(
        `Internal server error while fetching transports`,
      );
    }
  }
}
