import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
  @ApiProperty()
  statusCode: number;
}
