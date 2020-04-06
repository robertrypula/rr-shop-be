import { Order } from '../entity/order';
import { Status } from '../models/order.model';

// const DEFAULT = require('./email-templates/default.html');

export class TemplateService {
  public getOrderEmailHtml(order: Order): string {
    // TODO implement html template loading
    return '{{ MESSAGE }}'.replace('{{ MESSAGE }}', `<pre>${JSON.stringify(order)}</pre>`);
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
    }
  }
}
