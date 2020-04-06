import { Request, Response } from 'express';

import { EMAIL_SEND_DEFAULT_LIMIT, EMAIL_SEND_MAX_LIMIT } from '../config';
import { Email } from '../entity/email';
import { EmailIsSentPatchDto } from '../rest-api/email.dtos';
import { EmailService } from '../services/email.service';

export class EmailController {
  public constructor(protected emailService: EmailService = new EmailService()) {}

  public async patchIsSend(req: Request, res: Response): Promise<void> {
    const emailIsSentPatchDto: EmailIsSentPatchDto = req.body;
    const limit: number = this.getLimit(req);
    let emails: Email[];

    if (!this.isEmailIsSentPatchDtoValid(emailIsSentPatchDto)) {
      res.status(400).send({ errorMessage: 'You can patch only isSent field to true' });
      return;
    }

    if (limit < 1 || limit > EMAIL_SEND_MAX_LIMIT) {
      res.status(400).send({ errorMessage: 'Limit parameter out of range' });
      return;
    }

    try {
      emails = await this.emailService.getEmailsForSend(limit);
    } catch (error) {
      res.status(500).send({ errorMessage: 'Error occurred while fetching emails' });
      return;
    }

    try {
      await this.emailService.sendEmails(emails);
    } catch (error) {
      res.status(500).send({ errorMessage: `Error occurred while sending emails ${error}` });
      return;
    }

    res.send(emails.map((email: Email): { createdAt: Date } => ({ createdAt: email.createdAt })));
  }

  protected getLimit(req: Request): number {
    return typeof req.query.limit !== 'undefined' && +req.query.limit > 0 ? +req.query.limit : EMAIL_SEND_DEFAULT_LIMIT;
  }

  protected isEmailIsSentPatchDtoValid(emailIsSentPatchDto: EmailIsSentPatchDto): boolean {
    return (
      emailIsSentPatchDto &&
      Object.keys(emailIsSentPatchDto).join(',') === 'isSent' &&
      emailIsSentPatchDto.isSent === true
    );
  }
}
