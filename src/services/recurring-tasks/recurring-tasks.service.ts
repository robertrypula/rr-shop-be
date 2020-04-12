import { Email } from '../../entity/email';
import { EmailService } from '../email/email.service';

export class RecurringTasksService {
  public constructor(protected emailService: EmailService = new EmailService()) {}

  public async sendEmails(): Promise<number> {
    const emails: Email[] = await this.emailService.getEmailsNotYetSent();

    await this.emailService.send(emails);

    return emails.length;
  }
}
