import { DeliveryType, PaymentType, ProductFixture } from '../../models/product.model';
import { DELIVERIES, PAYMENTS } from './categories';

export const productFixtures: ProductFixture[] = [
  [['Odbiór osobisty', '', 0.0, 1000000, '', DeliveryType.Own, null], [DELIVERIES], [], ``],
  [['Paczkomaty', '', 8.99, 1000000, '', DeliveryType.Paczkomaty, null], [DELIVERIES], [], ``],
  [['Kurier', '', 12.0, 1000000, '', DeliveryType.Courier, null], [DELIVERIES], [], ``],
  [['Przelew bankowy', '', 0.0, 1000000, '', null, PaymentType.BankTransfer], [PAYMENTS], [], ``],
  [['Płatność elektroniczna PayU', '', 0.5, 1000000, '', null, PaymentType.PayU], [PAYMENTS], [], ``]
];
