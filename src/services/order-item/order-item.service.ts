import { OrderItemRepositoryService } from './order-item-repository.service';

export class OrderItemService {
  public constructor(
    protected orderItemRepositoryService: OrderItemRepositoryService = new OrderItemRepositoryService()
  ) {}
}
