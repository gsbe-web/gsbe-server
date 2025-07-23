import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
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
  PaginatedDataResponseDto,
  throwError,
} from '@utils/responses';

import {
  CreateMemberDto,
  FindMembersQueryDto,
  GetMemberDto,
  UpdateMemberDto,
} from './dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  private logger = new Logger(MembersController.name);
  constructor(private readonly membersService: MembersService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Member details',
    type: CreateMemberDto,
    required: true,
  })
  @ApiCreatedSuccessResponse({
    type: GetMemberDto,
    description: 'Member created successfully',
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
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() dto: CreateMemberDto,
  ) {
    try {
      const response = await this.membersService.create(dto, file);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.CREATED,
        'Member created successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiOkResponsePaginated({
    type: GetMemberDto,
    description: 'Members retrieved successfully',
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
  async findAll(@Query() query: FindMembersQueryDto) {
    try {
      const response = await this.membersService.findAll(query);
      const paginated = new PaginatedDataResponseDto(
        response.rows,
        query.page ?? 1,
        query.pageSize ?? 1,
        response.count,
      );
      return new ApiSuccessResponseDto(
        paginated,
        HttpStatus.OK,
        'Members retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiSuccessResponse({
    type: GetMemberDto,
    description: 'Member successfully retrieved',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Member not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Get(':id')
  async findOne(@Param() params: GetParam) {
    try {
      const response = await this.membersService.findOneById(params.id);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Member retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiSuccessResponse({
    type: GetMemberDto,
    description: 'Member successfully retrieved',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Member not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Get('slug/:slug')
  async findOneBySlug(@Param('slug') slug: string) {
    try {
      const response = await this.membersService.findOneBySlug(slug);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Member retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Member details',
    type: UpdateMemberDto,
    required: true,
  })
  @ApiSuccessResponse({
    type: GetMemberDto,
    description: 'Member updated successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Member not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Patch(':id')
  async update(
    @Param() params: GetParam,
    @UploadedFile()
    file: Express.Multer.File,
    @Body() dto: UpdateMemberDto,
  ) {
    try {
      const response = await this.membersService.update(params.id, dto, file);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Member updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @ApiDeletedSucessResponse({
    description: 'Member deleted successfully',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'Validation error occured',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Member not found',
  })
  @ApiInternalServerErrorResponse({
    type: ApiErrorResponse,
    description: 'An unexpected error occured',
  })
  @Delete(':id')
  async remove(@Param() params: GetParam) {
    try {
      const response = await this.membersService.remove(params.id);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Member deleted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
}
