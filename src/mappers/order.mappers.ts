import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { OrderCreateRequestDto, OrderCreateRequestOrderItemDto } from '../rest-api/order/order.dtos';

export const fromOrderCreateRequestDto = (dto: OrderCreateRequestDto): Order => {
  const order: Order = new Order();

  order.orderItems = [];
  dto.orderItems.forEach((orderItemDto: OrderCreateRequestOrderItemDto): void => {
    const orderItem: OrderItem = new OrderItem();

    orderItem.priceUnitOriginal = orderItemDto.priceUnitOriginal;
    orderItem.priceUnitSelling = orderItemDto.priceUnitSelling;
    orderItem.productId = orderItemDto.productId;
    orderItem.quantity = orderItemDto.quantity;

    order.orderItems.push(orderItem);
  });

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
