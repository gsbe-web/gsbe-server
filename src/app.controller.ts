import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get()
  hello() {
    return 'GSBE Services: All Green';
  }
}
