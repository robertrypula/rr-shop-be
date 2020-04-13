import { Request, Response } from 'express';

import { PayUService } from '../services/pay-u/pay-u.service';
import { Headers } from '../simple-pay-u/models';

export class PayUController {
  public constructor(protected payUService: PayUService = new PayUService()) {}

  public async notify(req: Request, res: Response): Promise<void> {
    try {
      await this.payUService.handleNotificationRequest(req.headers as Headers, req.body);
    } catch (error) {
      res
        .contentType('application/json')
        .status(500)
        .send(JSON.stringify({ error: `${error}` }));
      return;
    }

    res.contentType('application/json').send({});
  }
}
