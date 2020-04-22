import { Request, Response } from 'express';

import { SupplyService } from '../../services/supply/supply.service';

export class AdminSupplyController {
  public constructor(protected supplyService: SupplyService = new SupplyService()) {}

  public async patchOrderItemId(req: Request, res: Response): Promise<void> {
    const body: { orderItemId: number } = req.body;

    try {
      await this.supplyService.adminChangeOrderItemId(req.params.id ? +req.params.id : null, body.orderItemId);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.send();
  }
}
