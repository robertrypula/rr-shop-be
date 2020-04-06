import { DEFAULT } from '../email-templates/default';
import { Order } from '../entity/order';
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
    switch (order.status) {
      case Status.PaymentWait:
        return `Waleriana.pl - nowe zamówienie ${order.number}`;
      case Status.PaymentCompleted:
        return `Waleriana.pl - zamówienie ${order.number} zostało opłacone`;
      case Status.Shipped:
        return `Waleriana.pl - paczka do zamówienia ${order.number} została wysłana`;
      case Status.ReadyForPickup:
        return `Waleriana.pl - zamówienie ${order.number} gotowe do odbioru osobistego`;
      case Status.Completed:
        return `Waleriana.pl - zamówienie ${order.number} zostało zakończone, dziękujemy!`;
      case Status.Cancelled:
        return `Waleriana.pl - zamówienie ${order.number} zostało anulowane`;
      default:
        return `Waleriana.pl - zamówienie ${order.number}`;
    }
  }
}
