import { validate, ValidationError } from 'class-validator';

import { OrderCreateRequestDto } from './order.dtos';

export const validateOrderCreateRequestDto = async (
  orderCreateRequestDto: OrderCreateRequestDto
): Promise<string[]> => {
  const validationErrors: ValidationError[] = await validate(orderCreateRequestDto);
  // console.log(validationErrors);
  let errors: string[] = [];

  validationErrors.forEach((validationError: ValidationError): void => {
    errors = [...errors, ...Object.values(validationError.constraints)];
  });

  return errors;
};
