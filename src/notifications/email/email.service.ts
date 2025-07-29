import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(private mailService: MailerService) {}

  send(mail: ISendMailOptions) {
    this.mailService
      .sendMail(mail)
      .then((success) => {
        this.logger.log('mail sent!', success);
      })
      .catch((err) => {
        this.logger.error('error sending mail!', err);
      });
  }
}
