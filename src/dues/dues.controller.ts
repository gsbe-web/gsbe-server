import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  ApiCreatedSuccessResponse,
  ApiDeletedSucessResponse,
  ApiOkResponsePaginated,
  ApiSuccessResponse,
} from '@shared/decorators';
import { GetParam } from '@shared/dto';
import {
  ApiErrorResponse,
  ApiSuccessResponseDto,
  throwError,
} from '@utils/responses';

import {
  CreateDueDto,
  CreateDueResponseDto,
  FindDuesQueryDto,
  GetDueDto,
  GetDuesDto,
  PaymentProcesedDto,
  PaystackWebhookDto,
} from './dto';
import { DuesService } from './dues.service';

@Controller('dues')
export class DuesController {
  private logger = new Logger(DuesController.name);
  constructor(private readonly duesService: DuesService) {}

  @ApiCreatedSuccessResponse({
    type: CreateDueResponseDto,
    description: 'Due payment initialized successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unknown error occured',
  })
  @Post()
  async create(@Body() createDueDto: CreateDueDto) {
    try {
      const response = await this.duesService.create(createDueDto);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.CREATED,
        'Due payment initialized successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiSuccessResponse({
    type: PaymentProcesedDto,
    description: 'Webhook processed successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Invalid signature',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unknown error occured',
  })
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(
    @Body() paystackWebhook: PaystackWebhookDto,
    @Headers('x-paystack-signature') paystackSignature: string,
  ) {
    try {
      const signature = paystackSignature;
      if (!signature) {
        throw new BadRequestException('Invalid signature');
      }
      this.logger.log('webhook data', paystackWebhook.data);
      const response = await this.duesService.processWebhook(
        paystackWebhook,
        signature,
      );
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Webhook processed successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiOkResponsePaginated({
    type: GetDuesDto,
    description: 'Dues retrieved successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unknown error occured',
  })
  @Get()
  async findAll(@Query() query: FindDuesQueryDto) {
    try {
      const response = await this.duesService.findAll(query);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Dues retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiSuccessResponse({
    type: GetDueDto,
    description: 'Due retrieved successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Due not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unknown error occured',
  })
  @Get(':id')
  async findOne(@Param() params: GetParam) {
    try {
      const response = await this.duesService.findOne(params.id);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Due retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiDeletedSucessResponse({
    description: 'Due deleted successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Due not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unknown error occured',
  })
  @Delete(':id')
  async remove(@Param() params: GetParam) {
    try {
      const response = await this.duesService.remove(params.id);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Due deleted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
}
