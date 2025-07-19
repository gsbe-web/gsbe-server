import { CloudinaryService } from '@cloudinary/cloudinary.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createSlug } from '@shared/generator';
import { generateFilter } from '@utils/helpers';
import { Model } from 'mongoose';

import { CreateMemberDto, FindMembersQueryDto, UpdateMemberDto } from './dto';
import { Member } from './entities';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateMemberDto,
    file: Express.Multer.File,
  ): Promise<Member> {
    const image = await this.cloudinaryService.uploadFile(file);
    dto.imageId = image.public_id;
    dto.imageUrl = image.secure_url;
    dto.slug = createSlug(dto.name);

    const member = await this.memberModel.create({ ...dto });
    return member;
  }

  async findAll(
    query: FindMembersQueryDto,
  ): Promise<{ rows: Member[]; count: number }> {
    const { pageFilter, searchFilter } = generateFilter(query);

    const members = await this.memberModel
      .find({ ...searchFilter })
      .skip(pageFilter.skip)
      .limit(pageFilter.take)
      .sort(pageFilter.orderBy);

    const membersCount = await this.memberModel.countDocuments({
      ...searchFilter,
    });

    return {
      rows: members,
      count: membersCount,
    };
  }

  //check getEventById
  async findOneById(id: string): Promise<Member> {
    const member = await this.memberModel.findById(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  //check getEventBySlug
  async findOneBySlug(slug: string): Promise<Member> {
    const member = await this.memberModel.findOne({ slug });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  //check editEvent
  async update(
    _id: string,
    _dto: UpdateMemberDto,
    _file?: Express.Multer.File,
  ): Promise<Member> {
    return;
  }

  //check deleteEventById
  async remove(id: string): Promise<boolean> {
    const member = await this.memberModel.findByIdAndDelete(id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    await this.cloudinaryService.deleteFile(member.imageId);

    return true;
  }
}
