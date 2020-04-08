import { validate, ValidationError } from 'class-validator';

import { extractConstraints } from '../../utils/transformation.utils';
import { OrderCreateRequestDto } from './order.dtos';

export const validateOrderCreateRequestDto = async (
  orderCreateRequestDto: OrderCreateRequestDto
): Promise<string[]> => {
  const validationErrors: ValidationError[] = await validate(orderCreateRequestDto, { forbidUnknownValues: true });
  const errors: string[] = [];

  extractConstraints(validationErrors, errors);

  return errors;
};
