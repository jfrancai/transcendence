import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const createSchema = Joi.object({
  email: Joi.string().optional(),
  username: Joi.string().required(),
  password: Joi.string().required()
});

@Injectable()
export class ContentValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const objectUnknown = value;

    if (metadata.type === 'body' && metadata.data === undefined) {
      const { error } = this.schema.validate(objectUnknown);
      if (error) {
        throw new HttpException(
          'Validation failed object need the right property',
          HttpStatus.BAD_REQUEST
        );
      }
      return objectUnknown;
    }
    throw new HttpException('Need a body', HttpStatus.BAD_REQUEST);
  }
}
