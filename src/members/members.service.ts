import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { generateFilter } from 'src/utils/helpers';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto, FindMembersQueryDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(private readonly prismaService: PrismaService) {}
  //check addEvent
  async create(
    _dto: CreateMemberDto,
    _file: Express.Multer.File,
  ): Promise<Member> {
    return;
  }

  //check getEvents
  async findAll(
    query: FindMembersQueryDto,
  ): Promise<{ rows: Member[]; count: number }> {
    const queryFilter = generateFilter(query);

    const findOptions: object = {
      where: {
        ...queryFilter.searchFilter,
      },
      ...queryFilter.pageFilter,
    };

    const members = await this.prismaService.member.findMany({
      ...findOptions,
    });

    const membersCount = await this.prismaService.member.count({
      where: {
        ...queryFilter.searchFilter,
      },
    });
    //replace with actual results:  {rows: members, count: membersCount}

    return {
      rows: members,
      count: membersCount,
    };
  }

  //check getEventById
  async findOneById(_id: string): Promise<Member> {
    return;
  }

  //check getEventBySlug
  async findOneBySlug(_slug: string): Promise<Member> {
    return;
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
  async remove(_id: string): Promise<void> {
    return;
  }
}
