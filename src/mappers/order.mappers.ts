import { Order } from '../entity/order';
import { OrderCreateRequestDto } from '../rest-api/order/order.dtos';

export const fromOrderCreateRequestDto = (dto: OrderCreateRequestDto): Order => {
  const order: Order = new Order();

  order.email = dto.email;
  order.phone = dto.phone;
  order.name = dto.name;
  order.surname = dto.surname;
  order.address = dto.address;
  order.zipCode = dto.zipCode;
  order.city = dto.city;
  order.comments = dto.comments ? dto.comments : null;
  order.parcelLocker = dto.parcelLocker ? dto.parcelLocker : null;

  return order;
};
