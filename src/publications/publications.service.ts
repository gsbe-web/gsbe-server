import { Injectable, NotFoundException } from '@nestjs/common';
import { Publication } from '@prisma/client';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueryDto } from '../shared/dto/pagination.dto';
import { createSlug } from '../shared/generator';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreatePublicationDto, file: Express.Multer.File) {
    const postImage = await this.cloudinaryService.uploadFile(file);

    dto.slug = createSlug(dto.title);
    dto.postImageId = postImage.public_id;
    dto.profileImageUrl = postImage.secure_url;
    const publication = await this.prisma.publication.create({
      data: {
        ...dto,
      },
    });
    return publication;
  }

  async retrieveAll(dto: QueryDto) {
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

    const publications = await this.prisma.publication.findMany({
      ...findOptions,
    });

    const numberOfPublications = await this.prisma.publication.count({
      where: {
        OR: dto.searchQueries,
      },
      orderBy: {
        dateTimePosted: 'desc',
      },
    });

    return new PaginatedDataResponseDto<Publication[]>(
      publications,
      dto.page,
      dto.pageSize,
      numberOfPublications,
    );
  }

  async retrieveById(id: string): Promise<Publication> {
    const publication = await this.prisma.publication.findUnique({
      where: {
        id: id,
      },
    });
    if (!publication) {
      throw new NotFoundException('Publication item not found');
    }
    return publication;
  }

  async retrieveBySlug(slug: string): Promise<Publication> {
    const publication = await this.prisma.publication.findUnique({
      where: {
        slug: slug,
      },
    });
    if (!publication) {
      throw new NotFoundException(`Publication not found`);
    }
    return publication;
  }

  async updateLikes(slug: string, likeCount: number) {
    const updatedLike = await this.prisma.publication.update({
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
    const publication = await this.prisma.publication.findUnique({
      where: {
        slug,
      },
      select: {
        likes: true,
      },
    });
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    return publication.likes;
  }

  async edit(id: string, dto: UpdatePublicationDto, file: Express.Multer.File) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    if (file) {
      const postImage = await this.cloudinaryService.updateFileContent(
        file,
        publication.postImageId,
      );
      dto.postImageId = postImage.public_id;
      dto.postImageUrl = postImage.secure_url;
    }

    if (dto.title) {
      const slug: string = dto.title && createSlug(dto.title);
      dto.slug = slug;
    }

    const updatedPublication = await this.prisma.publication.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
    return updatedPublication;
  }

  async delete(id: string) {
    const publication = await this.prisma.publication.findFirst({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    const deletedPublication = await this.prisma.publication.delete({
      where: { id },
    });

    await this.cloudinaryService.deleteFile(deletedPublication.postImageId);

    return true;
  }
}
