import { NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { News } from '@prisma/client';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { QueryDto } from './dto/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { createSlug } from '../shared/generator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createNews(dto: CreateNewsDto, file: Express.Multer.File) {
    const postImage = await this.cloudinaryService.uploadFile(file);

    dto.slug = createSlug(dto.title);
    dto.postImageId = postImage.public_id;
    dto.profileImageUrl = postImage.secure_url;
    const news = await this.prisma.news.create({
      data: {
        ...dto,
      },
    });
    return news;
  }

  async retrieveAllNews(dto: QueryDto) {
    const offset = (dto.page - 1) * dto.pageSize;
    if (dto.search && dto.searchFields) {
      const searchBodies = dto.searchFields.map((field) => ({
        [field]: {
          contains: dto.search,
          mode: 'insensitive',
        },
      }));
      dto.searchQueries = searchBodies;
    }

    const findOptions: object = {
      where: {
        OR: dto.searchQueries,
      },
      take: dto.pageSize,
      skip: offset,
      orderBy: {
        dateTimePosted: 'desc',
      },
    };

    const news = await this.prisma.news.findMany({ ...findOptions });

    const numberOfNews = await this.prisma.news.count({
      where: {
        OR: dto.searchQueries,
      },
      orderBy: {
        dateTimePosted: 'desc',
      },
    });

    return new PaginatedDataResponseDto<News[]>(
      news,
      dto.page,
      dto.pageSize,
      numberOfNews,
    );
  }

  async newsById(id: string): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: {
        id: id,
      },
    });
    if (!news) {
      throw new NotFoundException('News item not found');
    }
    return news;
  }

  async editNews(id: string, dto: UpdateNewsDto, file: Express.Multer.File) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    if (file) {
      const postImage = await this.cloudinaryService.updateFileContent(
        file,
        news.postImageId,
      );
      dto.postImageId = postImage.public_id;
      dto.postImageUrl = postImage.secure_url;
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
  }

  async deleteNews(id: string) {
    const news = await this.prisma.news.findFirst({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    const deletedNews = await this.prisma.news.delete({
      where: { id },
    });

    await this.cloudinaryService.deleteFile(deletedNews.postImageId);

    return true;
  }

  async newsBySlug(slug: string): Promise<News> {
    const news = await this.prisma.news.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!news) {
      throw new NotFoundException(`News not found`);
    }
    return news;
  }

  async updateLikes(slug: string, likeCount: number) {
    const updatedLike = await this.prisma.news.update({
      where: {
        slug: slug,
      },
      data: {
        likes: likeCount,
      },
    });
    return updatedLike;
  }

  async getLikeCount(slug: string) {
    const news = await this.prisma.news.findUnique({
      where: {
        slug,
      },
      select: {
        likes: true,
      },
    });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news.likes;
  }
}
