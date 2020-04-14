import { Email } from '../../entity/email';
import { Payment } from '../../entity/payment';
import * as fromOrderModels from '../../models/order.models';
import * as fromPaymentModels from '../../models/payment.models';
import { PaymentType } from '../../models/product.models';
import { Notification, NotificationOrderStatus } from '../../simple-pay-u/models';
import { EmailRepositoryService } from '../email/email-repository.service';
import { OrderRepositoryService } from '../order/order-repository.service';
import { TemplateService } from '../template.service';
import { PaymentRepositoryService } from './payment-repository.service';

export class PaymentService {
  public constructor(
    protected paymentRepositoryService: PaymentRepositoryService = new PaymentRepositoryService(),
    protected orderRepositoryService: OrderRepositoryService = new OrderRepositoryService(),
    protected emailRepositoryService: EmailRepositoryService = new EmailRepositoryService(),
    protected templateService: TemplateService = new TemplateService()
  ) {}

  public async handlePayUNotification(notification: Notification): Promise<void> {
    let email: Email;
    const payment: Payment = await this.paymentRepositoryService.getPaymentWithFullOrder(
      notification.orderId,
      notification.extOrderId
    );

    if (!payment || payment.paymentType !== PaymentType.PayU) {
      throw 'Could not find PayU entry that matches notification payload';
    }

    console.log(payment);
    // console.log(notification);

    switch (notification.status) {
      case NotificationOrderStatus.PENDING:
        break;
      case NotificationOrderStatus.COMPLETED:
        payment.status = fromPaymentModels.Status.Completed;
        payment.order.status = fromOrderModels.Status.PaymentCompleted;
        email = await this.createEmail(payment);
        break;
      case NotificationOrderStatus.CANCELED:
        payment.status = fromPaymentModels.Status.Completed;
        payment.order.status = fromOrderModels.Status.Canceled;
        email = await this.createEmail(payment);
        break;
    }

    payment.appendLog(notification.status);

    // TODO wrap it with transaction
    await this.paymentRepositoryService.save(payment);
    await this.orderRepositoryService.save(payment.order);
    email && (await this.emailRepositoryService.save(email));
  }

  protected async createEmail(payment: Payment): Promise<Email> {
    return new Email()
      .setTo(payment.order.email)
      .setSubject(await this.templateService.getOrderEmailSubject(payment.order))
      .setHtml(await this.templateService.getOrderEmailHtml(payment.order))
      .setOrder(payment.order);
  }
}
