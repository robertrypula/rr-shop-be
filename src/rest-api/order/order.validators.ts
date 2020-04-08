import { validate, ValidationError } from 'class-validator';

import { OrderCreateRequestDto } from './order.dtos';

export const extractConstraints = (validationErrors: ValidationError[], errors: string[]): void => {
  validationErrors.forEach((validationError: ValidationError): void => {
    validationError.constraints &&
      Object.values(validationError.constraints).forEach((constraint: string): number => errors.push(constraint));
    validationError.children && extractConstraints(validationError.children, errors);
  });
};

export const validateOrderCreateRequestDto = async (
  orderCreateRequestDto: OrderCreateRequestDto
): Promise<string[]> => {
  const validationErrors: ValidationError[] = await validate(orderCreateRequestDto, { forbidUnknownValues: true });
  const errors: string[] = [];

  extractConstraints(validationErrors, errors);

  return errors;
};
