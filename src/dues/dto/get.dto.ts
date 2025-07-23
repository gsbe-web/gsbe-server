import { ApiResponseProperty, OmitType, PickType } from '@nestjs/swagger';
import { QueryDto } from '@shared/dto';

import { DueDto } from './model.dto';
import { InitializeResponseDataDto } from './paystack.dto';

export class CreateDueResponseDto extends InitializeResponseDataDto {}

export class PaymentProcesedDto {
  @ApiResponseProperty({ example: 'OK' })
  status: string;
}

export class GetDuesDto extends PickType(DueDto, [
  'id',
  'firstName',
  'membershipId',
  'status',
  'amount',
  'email',
  'paidAt',
]) {}

export class GetDueDto extends OmitType(DueDto, [
  'createdAt',
  'updatedAt',
  'authorizationUrl',
]) {}

export class FindDuesQueryDto extends QueryDto {}
