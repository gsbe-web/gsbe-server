import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Logger,
} from '@nestjs/common';
import { throwError } from '../utils/responses/error.responses';
import { NewsService } from './news.service';
import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateNewsDto } from './dto/create-news.dto';
import {
  ApiSuccessResponseDto,
  ApiSuccessResponseNull,
} from '../utils/responses/success.responses';
import { FileInterceptor } from '@nestjs/platform-express';
import { News } from '@prisma/client';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { QueryDto } from './dto/pagination-query.dto';
import {
  ApiCreatedSuccessResponse,
  ApiDeletedSucessResponse,
  ApiSuccessResponse,
} from '../shared/decorators/success-response.decorator';
import { ApiOkResponsePaginated } from '../shared/decorators/paginated-response.decorator';
import { UpdateLikesDto, UpdateNewsDto } from './dto/update-news.dto';
import { GetParam } from '../shared/dto/get-param.dto';
import { ApiErrorResponse } from '../utils/responses/error.responses';
import { GetLikesDto, GetNewsDto } from './dto';

@ApiTags('News Controller')
@Controller('news')
export class NewsController {
  private logger = new Logger(NewsController.name);
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'News details',
    type: CreateNewsDto,
    required: true,
  })
  @ApiCreatedSuccessResponse({
    type: GetNewsDto,
    description: 'News created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateNewsDto,
  ) {
    try {
      const response = await this.newsService.createNews(dto, file);
      return new ApiSuccessResponseDto<News>(
        response,
        HttpStatus.CREATED,
        'news created successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'News details',
    type: UpdateNewsDto,
    required: true,
  })
  @ApiSuccessResponse({
    type: GetNewsDto,
    description: 'News updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param() params: GetParam,
    @Body() dto: UpdateNewsDto,
  ) {
    try {
      const response = await this.newsService.editNews(params.id, dto, file);
      return new ApiSuccessResponseDto<News>(
        response,
        HttpStatus.OK,
        'news updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get()
  @ApiOkResponsePaginated({
    type: GetNewsDto,
    description: 'News retrieved successfully',
  })
  async getAll(@Query() dto: QueryDto) {
    try {
      const response = await this.newsService.retrieveAllNews(dto);
      return new ApiSuccessResponseDto<PaginatedDataResponseDto<News[]>>(
        response,
        HttpStatus.OK,
        'all news retrieved successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get(':id')
  @ApiSuccessResponse({
    type: GetNewsDto,
    description: 'News item successfully retrieved',
  })
  async getNewsById(@Param('id') id: string) {
    try {
      const response = await this.newsService.newsById(id);
      return new ApiSuccessResponseDto<News>(
        response,
        HttpStatus.OK,
        `News item of ${id} has been retrieved`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Delete(':id')
  @ApiDeletedSucessResponse({
    description: 'news deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deleteNews(@Param() params: GetParam) {
    try {
      const _response = await this.newsService.deleteNews(params.id);
      return new ApiSuccessResponseNull(
        HttpStatus.OK,
        'news deleted successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Get('/slug/:slug')
  @ApiSuccessResponse({
    type: GetNewsDto,
    description: 'News item successfully retrieved',
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponse,
    description: 'bad request',
  })
  @ApiNotFoundResponse({
    type: ApiErrorResponse,
    description: 'News not found',
  })
  async getNewsBySlug(@Param('slug') slug: string) {
    try {
      const response = await this.newsService.newsBySlug(slug);
      return new ApiSuccessResponseDto<News>(
        response,
        HttpStatus.OK,
        `News item with slug ${slug} has been retrieved`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }

  @Patch(':slug/likes')
  @ApiSuccessResponse({
    type: GetNewsDto,
    description: 'the like count has been updated successfully',
  })
  async updateNewsLikes(
    @Param('slug') slug: string,
    @Body() dto: UpdateLikesDto,
  ) {
    try {
      const response = await this.newsService.updateLikes(slug, dto.likes);
      return new ApiSuccessResponseDto<News>(
        response,
        HttpStatus.OK,
        'news likes updated successfully',
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
  @Get(':slug/likes')
  @ApiSuccessResponse({
    type: GetLikesDto,
    description: 'News item successfully retrieved',
  })
  async getLikeCount(@Param('slug') slug: string) {
    try {
      const likes = await this.newsService.getLikeCount(slug);
      return new ApiSuccessResponseDto(
        { likes },
        HttpStatus.OK,
        `Number of likes for news item with slug ${slug} has been retrieved`,
      );
    } catch (error) {
      throwError(this.logger, error);
    }
  }
}
