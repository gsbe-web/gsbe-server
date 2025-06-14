import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

export function throwError(logger: Logger, error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      logger.warn(`${error.meta?.target} already exists`);
      throw new BadRequestException(`${error.meta?.target} is already in use`);
    }
    if (error.code === 'P2003') {
      throw new BadRequestException(
        `Foreign key constraint violation ${error.meta?.field_name}`,
      );
    }
  }
  if (error instanceof HttpException) {
    throw error;
  }
  logger.error(
    `An error occured: ${error.name} :: ${error.message}`,
    error.stack,
  );
  throw new InternalServerErrorException(error.message, error);
}
