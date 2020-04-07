import { getSecretConfig } from '../config';
import { DEFAULT } from '../email-templates/default';
import { Order } from '../entity/order';
import { SecretConfig } from '../models/model';
import { Status } from '../models/order.model';

// TODO implement html template loading
// TODO check why it's not working with ts-node-dev package
// https://github.com/robertrypula/audio-network-reborn/commit/d37ea6bcdfa84ca5b325da09195bd1c9de79be31
// const DEFAULT = require('./email-templates/default.html');

export class TemplateService {
  public getOrderEmailHtml(order: Order): string {
    const message: string = [
      `<pre style="font-size: 11px; line-height: 1.1em; font-family: monospace;">`,
      `${JSON.stringify(order, null, 2)}`,
      `</pre>`
    ].join('');

    return DEFAULT.replace('{{ MESSAGE }}', message);
  }

  public getOrderEmailSubject(order: Order): string {
    const secretConfig: SecretConfig = getSecretConfig();
    const fullPrefix = `${secretConfig.gmail.subjectPrefix}Waleriana.pl - `;

    switch (order.status) {
      case Status.PaymentWait:
        return `${fullPrefix}nowe zamówienie ${order.number}`;
      case Status.PaymentCompleted:
        return `${fullPrefix}zamówienie ${order.number} zostało opłacone`;
      case Status.Shipped:
        return `${fullPrefix}paczka do zamówienia ${order.number} została wysłana`;
      case Status.ReadyForPickup:
        return `${fullPrefix}zamówienie ${order.number} gotowe do odbioru osobistego`;
      case Status.Completed:
        return `${fullPrefix}zamówienie ${order.number} zostało zakończone, dziękujemy!`;
      case Status.Cancelled:
        return `${fullPrefix}zamówienie ${order.number} zostało anulowane`;
      default:
        return `${fullPrefix}zamówienie ${order.number}`;
    }
  }
}
