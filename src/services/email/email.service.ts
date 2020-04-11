import { getSecretConfig } from '../../config';
import { DEFAULT_ATTACHMENTS } from '../../email-templates/default';
import { Email } from '../../entity/email';
import { SecretConfig } from '../../models/models';
import { SimpleGmail } from '../../simple-gmail/simple-gmail';
import { EmailRepositoryService } from './email-repository.service';

export class EmailService {
  public constructor(protected emailRepositoryService: EmailRepositoryService = new EmailRepositoryService()) {}

  public async send(emails: Email[]): Promise<void> {
    const simpleGmail: SimpleGmail = this.getSimpleGmail();

    for (let i = 0; i < emails.length; i++) {
      const email: Email = emails[i];

      if (!email.isSent) {
        await simpleGmail.send(email.to, email.subject, email.html, DEFAULT_ATTACHMENTS);
        email.isSent = true;
        await this.emailRepositoryService.save(email);
      }
    }
  }

  protected getSimpleGmail(): SimpleGmail {
    const secretConfig: SecretConfig = getSecretConfig();

    return new SimpleGmail({
      clientId: secretConfig.gmail.clientId,
      clientSecret: secretConfig.gmail.clientSecret,
      from: secretConfig.gmail.from,
      refreshToken: secretConfig.gmail.refreshToken,
      user: secretConfig.gmail.user
    });
  }
}
