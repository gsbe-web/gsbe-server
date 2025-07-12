import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  ApiSuccessResponseDto,
  ApiSuccessResponseNull,
} from '../../utils/responses/success.responses';

export const ApiSuccessResponse = ({
  type,
  description,
  isArray = false,
}: {
  type: any;
  description: string;
  isArray?: boolean; // Optional parameter to specify if the data is an array
}) =>
  applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, type),
    ApiOkResponse({
      description,
      schema: {
        ...(isArray
          ? {
              allOf: [
                { $ref: getSchemaPath(ApiSuccessResponseDto) },
                {
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(type) },
                    },
                  },
                },
              ],
            }
          : {
              allOf: [
                { $ref: getSchemaPath(ApiSuccessResponseDto) },
                {
                  properties: {
                    data: {
                      $ref: getSchemaPath(type),
                    },
                  },
                },
              ],
            }),
      },
    }),
  );

export const ApiCreatedSuccessResponse = <T extends Type<unknown>>({
  type,
  description,
}: {
  type: T;
  description: string;
}) =>
  applyDecorators(
    ApiExtraModels(ApiSuccessResponseDto, type),
    ApiCreatedResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(type),
              },
            },
          },
        ],
      },
    }),
  );

export const ApiDeletedSucessResponse = ({
  description,
}: {
  description: string;
}) =>
  applyDecorators(
    ApiExtraModels(ApiSuccessResponseNull),
    ApiOkResponse({
      description,
      schema: { $ref: getSchemaPath(ApiSuccessResponseNull) },
    }),
  );
