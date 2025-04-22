import { PartialType } from '@nestjs/swagger';
import { CreateRouteDTO } from './create-route.dto';

export class UpdateRouteDTO extends PartialType(CreateRouteDTO) {}
