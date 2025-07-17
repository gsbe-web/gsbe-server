import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

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
  if (error instanceof mongoose.Error) {
    if ((error as any).code === 11000) {
      const duplicateField = Object.keys((error as any).keyValue).join(', ');
      logger.warn(`${duplicateField} already exists`);
      throw new BadRequestException(`${duplicateField} is already in use`);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join('; ');
      throw new BadRequestException(`Validation failed: ${messages}`);
    }

    if (error instanceof mongoose.Error.CastError) {
      throw new BadRequestException(`Invalid ${error.path}: ${error.value}`);
    }
  }

  if (error instanceof HttpException) {
    throw error;
  }

  logger.error(
    `An error occurred: ${error.name} :: ${error.message}`,
    error.stack,
  );
  throw new InternalServerErrorException(error.message, error);
}
