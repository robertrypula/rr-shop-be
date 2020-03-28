import { MigrationInterface, QueryRunner } from 'typeorm';

import { Order } from '../entity/order';
import { OrderItem } from '../entity/order-item';
import { Product } from '../entity/product';
import { PromoCode } from '../entity/promo-code';
import { Supply } from '../entity/supply';

export class CreatePromoCodes1584659163123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const promoCode: PromoCode = new PromoCode();

    promoCode.percentageDiscount = 20;
    promoCode.name = 'RABAT-20';
    promoCode.isActive = true;

    await queryRunner.manager.save(promoCode);

    // ---------------------------------------
    const krwisciag = await queryRunner.manager.getRepository(Product).findOne(8);
    const dziewanna = await queryRunner.manager.getRepository(Product).findOne(9);

    await this.createSupply(queryRunner, krwisciag, 5);
    await this.createSupply(queryRunner, krwisciag, 3);
    await this.createSupply(queryRunner, krwisciag, 1);

    await this.createSupply(queryRunner, dziewanna, 12);
    await this.createSupply(queryRunner, dziewanna, 8);

    // --------------

    await this.createOrder(queryRunner, [{ product: dziewanna, quantity: 4 }, { product: krwisciag, quantity: 6 }]);
    await this.createOrder(queryRunner, [{ product: dziewanna, quantity: 1 }]);
    await this.createOrder(queryRunner, [{ product: krwisciag, quantity: 2 }]);
    await this.createOrder(queryRunner, [{ product: dziewanna, quantity: 7 }]);

    // dziewanna: 20    -12     -> 8
    // krwisciag: 9     -8     ->  1
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // empty
  }

  protected async createSupply(queryRunner: QueryRunner, product: Product, quantity: number): Promise<void> {
    for (let i = 0; i < quantity; i++) {
      const supply: Supply = new Supply();

      supply.priceUnitGross = 19.99;
      supply.product = product;
      supply.vat = 1;

      await queryRunner.manager.save(supply);
    }
  }

  protected async createOrder(
    queryRunner: QueryRunner,
    data: Array<{ product: Product; quantity: number }>
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

    data.forEach(d => {
      const orderItem = new OrderItem();

      orderItem.quantity = d.quantity;
      orderItem.product = d.product;
      orderItem.name = 'a';
      orderItem.vat = 3;
      orderItem.priceUnitOriginal = 3;
      orderItem.priceUnitSelling = 3;
      order.orderItems.push(orderItem);
    });

    return await queryRunner.manager.save(order);
  }
}
