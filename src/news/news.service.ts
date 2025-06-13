import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { News } from '@prisma/client';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { QueryDto } from './dto/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { createSlug } from '../shared/generator';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class NewsService {
  private logger: Logger;
  constructor(
    private readonly prisma: PrismaService,
    private googleDriveService: GoogleDriveService,
  ) {
    this.logger = new Logger(NewsService.name);
  }

  async createNews(dto: CreateNewsDto, file: Express.Multer.File) {
    try {
      const postImageUrl = await this.googleDriveService.uploadFile(file);

      const fileId = postImageUrl.fileId;
      // TODO::  save for later src={`https://drive.google.com/uc?export=view&id=${image.id}`}
      const slug: string = createSlug(dto.title);
      const news = await this.prisma.news.create({
        data: {
          slug,
          postImageId: fileId,
          ...dto,
        },
      });
      return news;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async retrieveAllNews(dto: QueryDto) {
    const offset = (dto.page - 1) * dto.pageSize;
    if (dto.search && dto.searchFields) {
      const searchBodies = dto.searchFields.map((field) => ({
        [field]: dto.search,
      }));
      dto.searchQueries = searchBodies;
    }

    const news = await this.prisma.news.findMany({
      where: {
        OR: dto.searchQueries,
      },
      take: dto.pageSize,
      skip: offset,
      orderBy: {
        dateTimePosted: 'desc',
      },
    });

    const numberOfNews = await this.prisma.news.count();

    return new PaginatedDataResponseDto<News[]>(
      news,
      dto.page,
      dto.pageSize,
      numberOfNews,
    );
  }

  async newsById(id: string): Promise<News> {
    try {
      const news = this.prisma.news.findUnique({
        where: {
          id: id,
        },
      });
      if (!news) {
        throw new NotFoundException('News item not found');
      }
      return news;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        this.logger.error('Internal Server Error:', error.meesage, error.stack);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async editNews(id: string, dto: UpdateNewsDto, file: Express.Multer.File) {
    try {
      const news = await this.prisma.news.findUnique({
        where: { id },
      });

      if (file) {
        const postImage = await this.googleDriveService.updateFileContent(
          news.postImageId,
          file,
        );

        dto.postImageId = postImage.id;
      }

      if (dto.title) {
        const slug: string = dto.title && createSlug(dto.title);
        dto.slug = slug;
      }

      const updatedNews = await this.prisma.news.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });
      return updatedNews;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async deleteNews(id: string) {
    try {
      const news = await this.prisma.news.findFirst({
        where: { id },
      });

      if (!news) {
        throw new NotFoundException('news not found');
      }

      const deletedNews = await this.prisma.news.delete({
        where: { id },
      });

      await this.googleDriveService.deleteFile(deletedNews.postImageId);

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          error.message ?? 'an unknown error occured',
        );
      }
    }
  }

  async newsBySlug(slug: string): Promise<News> {
    try {
      const news = this.prisma.news.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!news) {
        throw new NotFoundException(`News item not found`);
      }
      return news;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        this.logger.error('Internal Server Error:', error.meesage, error.stack);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async updateLikes(slug: string, likeCount: number) {
    try {
      const updatedLike = await this.prisma.news.update({
        where: {
          slug: slug,
        },
        data: {
          likes: likeCount,
        },
      });
      return updatedLike;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        this.logger.error('Internal Server Error:', error.message, error.stack);
        throw new InternalServerErrorException('An unexpected error ocurred');
      }
    }
  }

  async getLikeCount(slug: string) {
    try {
      const news = await this.prisma.news.findUnique({
        where: {
          slug,
        },
        select: {
          likes: true,
        },
      });
      if (!news) {
        throw new NotFoundException('News item not found');
      }
      return news.likes;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      } else {
        this.logger.error('Internal Server Error:', error.meesage, error.stack);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
}
