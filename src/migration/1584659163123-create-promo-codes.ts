import { MigrationInterface, QueryRunner } from 'typeorm';

import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Product } from '../entity/product';
import { PromoCode } from '../entity/promo-code';
import { Status } from '../models/order.models';

export class CreatePromoCodes1584659163123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const promoCode: PromoCode = new PromoCode();

    promoCode.percentageDiscount = 20;
    promoCode.name = 'RABAT-20';
    promoCode.isActive = true;

    await queryRunner.manager.save(promoCode);

    // ---------------------------------------
    // TODO remove tests below

    const p = async (externalId: number): Promise<Product> => {
      return await queryRunner.manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .where('product.externalId = :externalId', { externalId })
        .getOne();
    };

    /*
    await this.createOrder(queryRunner, Status.PaymentWait, [[await p(2), 4], [await p(3), 1]]);
    await this.createOrder(queryRunner, Status.Cancelled, [[await p(2), 2], [await p(1), 6]]);
    await this.createOrder(queryRunner, Status.Completed, [[await p(2), 1], [await p(3), 6], [await p(3), -4]]);

    // 50 order with 10 items each - 4.5 seconds to load all 292 products
    // without attaching order data - 150 ms
    for (let i = 0; i < 50; i++) {
      await this.createOrder(queryRunner, Status.Completed, [
        [await p(100 + 1), 1],
        [await p(100 + 2), 2],
        [await p(100 + 3), 3],
        [await p(100 + 4), 4],
        [await p(100 + 5), 5],
        [await p(100 + 6), 6],
        [await p(100 + 7), 7],
        [await p(100 + 8), 8],
        [await p(100 + 9), 9],
        [await p(100 + 10), 10]
      ]);
    }
    */
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected async createOrder(
    queryRunner: QueryRunner,
    status: Status,
    data: Array<[Product, number]>
  ): Promise<Order> {
    const order: Order = new Order();

    order.uuid = '123';
    order.number = 'WA-123';
    order.email = 'r@r.pl';
    order.phone = '+48 5';
    order.name = 'Na';
    order.surname = 'Na';
    order.address = 'Na';
    order.zipCode = '50';
    order.city = 'Wroclaw';
    order.orderItems = [];

    order.status = status;

    data.forEach(d => {
      const orderItem = new OrderItem();

      orderItem.quantity = d[1];
      orderItem.product = d[0];
      orderItem.name = 'a';
      orderItem.priceUnitOriginal = 3;
      orderItem.priceUnitSelling = 3;
      order.orderItems.push(orderItem);
    });

    return await queryRunner.manager.save(order);
  }
}
