import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { QueryDto } from '../shared/dto/pagination.dto';
import { createSlug } from '../shared/generator';
import { generateFilter } from '../utils/helpers';
import { PaginatedDataResponseDto } from '../utils/responses/success.responses';
import { CreatePublicationDto, UpdatePublicationDto } from './dto';
import { Publication } from './entities';

@Injectable()
export class PublicationsService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(Publication.name) private publicationModel: Model<Publication>,
  ) {}

  async create(dto: CreatePublicationDto, file: Express.Multer.File) {
    const postImage = await this.cloudinaryService.uploadFile(file);

    dto.slug = createSlug(dto.title);
    dto.postImageId = postImage.public_id;
    dto.profileImageUrl = postImage.secure_url;
    const publication = await this.publicationModel.create({ ...dto });

    return publication;
  }

  async retrieveAll(dto: QueryDto) {
    const { pageFilter, searchFilter } = generateFilter(dto);

    const publications = await this.publicationModel
      .find({ ...searchFilter })
      .skip(pageFilter.skip)
      .limit(pageFilter.take)
      .sort({ updatedAt: -1 });

    const publicationsNumber = await this.publicationModel.countDocuments({
      ...searchFilter,
    });

    return new PaginatedDataResponseDto<Publication[]>(
      publications,
      dto.page,
      dto.pageSize,
      publicationsNumber,
    );
  }

  async retrieveById(id: string): Promise<Publication> {
    const publication = await this.publicationModel.findById(id);
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    return publication;
  }

  async retrieveBySlug(slug: string): Promise<Publication> {
    const publication = await this.publicationModel.findOne({ slug });
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    return publication;
  }

  async updateLikes(slug: string, likeCount: number) {
    const updatedLike = await this.publicationModel.findOneAndUpdate(
      { slug },
      { likes: likeCount },
    );

    if (!updatedLike) {
      throw new NotFoundException('Publication not found');
    }

    return updatedLike;
  }

  async getLikeCount(slug: string) {
    const publication = await this.publicationModel
      .findOne({ slug })
      .select('likes');

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    return publication.likes;
  }

  async edit(id: string, dto: UpdatePublicationDto, file: Express.Multer.File) {
    const publication = await this.publicationModel.findById(id);

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
    const updatedPublication = await this.publicationModel.findByIdAndUpdate(
      id,
      dto,
    );
    return updatedPublication;
  }

  async delete(id: string) {
    const publication = await this.publicationModel.findByIdAndDelete(id);

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    await this.cloudinaryService.deleteFile(publication.postImageId);

    return true;
  }
}
