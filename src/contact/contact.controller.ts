import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from '@shared/decorators';
import {
  ApiErrorResponse,
  ApiSuccessResponseDto,
  throwError,
} from '@utils/responses';

import { ContactService } from './contact.service';
import { CreateContactDto } from './dto';

@Controller('contact')
export class ContactController {
  private logger = new Logger(ContactController.name);
  constructor(private readonly contactService: ContactService) {}

  @ApiSuccessResponse({
    type: CreateContactDto,
    description: 'Contact details submitted successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Post()
  async create(@Body() dto: CreateContactDto) {
    try {
      const response = await this.contactService.create(dto);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.CREATED,
        'Contact details submitted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiSuccessResponse({
    type: CreateContactDto,
    description: 'Contact details retrieved successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Get()
  async findAll() {
    try {
      const response = await this.contactService.findAll();
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Contact details retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
    return this.contactService.findAll();
  }

  @ApiSuccessResponse({
    type: CreateContactDto,
    description: 'Contact detail retrieved successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }
}
