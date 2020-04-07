import { validate, ValidationError } from 'class-validator';

import { OrderCreateRequestDto } from './order.dtos';

export const validateOrderCreateRequestDto = async (
  orderCreateRequestDto: OrderCreateRequestDto
): Promise<string[]> => {
  const validationErrors: ValidationError[] = await validate(orderCreateRequestDto, { forbidUnknownValues: true });
  let errors: string[] = [];

  console.log(validationErrors);

  validationErrors.forEach((validationError: ValidationError): void => {
    if (validationError.constraints) {
      errors = [...errors, ...Object.values(validationError.constraints)];
    }

    if (validationError.children && validationError.children.length) {
      validationError.children.forEach((validationErrorInner: ValidationError): void => {
        if (validationErrorInner.constraints) {
          errors = [...errors, ...Object.values(validationErrorInner.constraints)];
        }
      });
    }
  });

  return errors;
};
