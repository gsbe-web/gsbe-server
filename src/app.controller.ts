import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    return 'GSBE Services: All Green';
  }
}
