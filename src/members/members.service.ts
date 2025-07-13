import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';

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
    _query: FindMembersQueryDto,
  ): Promise<{ rows: Member[]; count: number }> {
    // this.prismaService.member.findMany()
    // this.prismaService.member.count()
    //replace with actual results:  {rows: members, count: membersCount}

    return {
      rows: [],
      count: 0,
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
