import { validate, ValidationError } from 'class-validator';

import { extractConstraints } from '../../utils/transformation.utils';
import { getDuplicates } from '../../utils/utils';
import { OrderCreateRequestDto, OrderCreateRequestOrderItemDto } from './order.dtos';

export const validateOrderCreateRequestDto = async (
  orderCreateRequestDto: OrderCreateRequestDto
): Promise<string[]> => {
  const validationErrors: ValidationError[] = await validate(orderCreateRequestDto, { forbidUnknownValues: true });
  const productIds: number[] = orderCreateRequestDto.orderItems.map(
    (orderCreateRequestOrderItemDto: OrderCreateRequestOrderItemDto): number => orderCreateRequestOrderItemDto.productId
  );
  const errors: string[] = [];

  extractConstraints(validationErrors, errors);

  if (getDuplicates(productIds).length) {
    errors.push('productId needs to be unique');
  }

  return errors;
};
