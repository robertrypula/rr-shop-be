import { OrderItem } from '../../entity/order-item';
import { Supply } from '../../entity/supply';
import { OrderItemRepositoryService } from '../order-item/order-item-repository.service';
import { SupplyRepositoryService } from './supply-repository.service';

export class SupplyService {
  public constructor(
    protected orderItemRepositoryService: OrderItemRepositoryService = new OrderItemRepositoryService(),
    protected supplyRepositoryService: SupplyRepositoryService = new SupplyRepositoryService()
  ) {}

  public async adminChangeOrderItemId(supplyId: number, orderItemId: number): Promise<void> {
    const supply: Supply = await this.supplyRepositoryService.getAdminSupply(supplyId);
    let orderItem: OrderItem;

    if (!supply) {
      throw `Could not find supply for given supplyId`;
    }

    if (orderItemId) {
      orderItem = await this.orderItemRepositoryService.getAdminOrderItem(orderItemId);
      if (!orderItem) {
        throw `Could not find orderItem for given orderItemId`;
      }
    }

    if (orderItemId === null) {
      supply.orderItem = null;
    } else {
      if (supply.product.getSuppliesCountAttachedToGivenOrderItemId(orderItemId) >= orderItem.quantity) {
        throw 'Cannot attach more orderItems to supplies than orderItem.quantity';
      }
      supply.orderItem = orderItem;
    }

    await this.supplyRepositoryService.save(supply);
  }
}
