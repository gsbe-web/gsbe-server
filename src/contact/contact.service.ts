import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@notifications/email/email.service';

import { CreateContactDto } from './dto';

@Injectable()
export class ContactService {
  constructor(
    private configService: ConfigService,
    private mailService: EmailService,
  ) {}

  async create(dto: CreateContactDto) {
    this.sendMessage(dto);
    return dto;
  }

  private sendMessage(payload: CreateContactDto) {
    const email = {
      from: `${payload.email}<${this.configService.get<string>('EMAIL_USERNAME')}>`,
      to: this.configService.get<string>('EMAIL_TO'),
      subject: payload.subject,
      template: './sendMessage',
      context: payload,
      replyTo: payload.email,
    };
    this.mailService.send(email);
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
