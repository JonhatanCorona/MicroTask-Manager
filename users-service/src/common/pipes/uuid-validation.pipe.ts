// src/common/pipes/uuid-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!isUuid(value)) {
      throw new BadRequestException(`Invalid UUID: ${value}`);
    }
    return value;
  }
}
