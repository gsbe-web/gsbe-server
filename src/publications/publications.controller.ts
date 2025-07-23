import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  ApiCreatedSuccessResponse,
  ApiDeletedSucessResponse,
  ApiOkResponsePaginated,
  ApiSuccessResponse,
} from '@shared/decorators';
import { GetParam, QueryDto } from '@shared/dto';
import {
  ApiErrorResponse,
  ApiSuccessResponseDto,
  ApiSuccessResponseNull,
  throwError,
} from '@utils/responses';

import {
  CreatePublicationDto,
  GetLikesDto,
  GetPublicationDto,
  UpdateLikesDto,
  UpdatePublicationDto,
} from './dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  private logger = new Logger(PublicationsController.name);
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Publications details',
    type: CreatePublicationDto,
    required: true,
  })
  @ApiCreatedSuccessResponse({
    type: GetPublicationDto,
    description: 'Publications created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePublicationDto,
  ) {
    try {
      const response = await this.publicationsService.create(dto, file);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.CREATED,
        'Publications created successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get()
  @ApiOkResponsePaginated({
    type: GetPublicationDto,
    description: 'Publications retrieved successfully',
  })
  async getAll(@Query() dto: QueryDto) {
    try {
      const response = await this.publicationsService.retrieveAll(dto);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'All Publications retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get(':id')
  @ApiSuccessResponse({
    type: GetPublicationDto,
    description: 'Publications item successfully retrieved',
  })
  async getPublicationsById(@Param() params: GetParam) {
    try {
      const { id } = params;
      const response = await this.publicationsService.retrieveById(id);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        `Publications item has been retrieved`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get('/slug/:slug')
  @ApiSuccessResponse({
    type: GetPublicationDto,
    description: 'Publications item successfully retrieved',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'bad request',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'Publications not found',
  })
  async getPublicationsBySlug(@Param('slug') slug: string) {
    try {
      const response = await this.publicationsService.retrieveBySlug(slug);
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Publications item has been retrieved',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get(':slug/likes')
  @ApiSuccessResponse({
    type: GetLikesDto,
    description: 'Publications item successfully retrieved',
  })
  async getLikeCount(@Param('slug') slug: string) {
    try {
      const likes = await this.publicationsService.getLikeCount(slug);
      return new ApiSuccessResponseDto(
        { likes },
        HttpStatus.OK,
        `Publications likes retrieved successfully`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Publications details',
    type: UpdatePublicationDto,
    required: true,
  })
  @ApiSuccessResponse({
    type: GetPublicationDto,
    description: 'Publications updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: GetParam,
    @Body() dto: UpdatePublicationDto,
  ) {
    try {
      const response = await this.publicationsService.edit(
        params.id,
        dto,
        file,
      );
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Publications updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Patch(':slug/likes')
  @ApiSuccessResponse({
    type: GetPublicationDto,
    description: 'the like count has been updated successfully',
  })
  async updatePublicationsLikes(
    @Param('slug') slug: string,
    @Body() dto: UpdateLikesDto,
  ) {
    try {
      const response = await this.publicationsService.updateLikes(
        slug,
        dto.likes,
      );
      return new ApiSuccessResponseDto(
        response,
        HttpStatus.OK,
        'Publications likes updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Delete(':id')
  @ApiDeletedSucessResponse({
    description: 'Publications deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deletePublications(@Param() params: GetParam) {
    try {
      const _response = await this.publicationsService.delete(params.id);
      return new ApiSuccessResponseNull(
        HttpStatus.OK,
        'Publications deleted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
}
