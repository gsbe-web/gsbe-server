import { Injectable } from '@nestjs/common';

import { CreateContactDto } from './dto';

@Injectable()
export class ContactService {
  async create(dto: CreateContactDto) {
    return dto;
  }

  async findAll() {
    return `This action returns all contact`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} contact`;
  }

  async remove(id: string) {
    return `This action removes a #${id} contact`;
  }
}
