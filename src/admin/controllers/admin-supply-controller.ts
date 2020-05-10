import { Request, Response } from 'express';

import { Supply } from '../../entity/supply';
import { SupplyService } from '../../services/supply/supply.service';
import { AdminSupplyOrderItemIdWriteRequestBody, AdminSupplyWriteRequestBody } from '../rest-api/supply.models';
import { AdminSupplyService } from '../services/supply/admin-supply.service';

export class AdminSupplyController {
  public constructor(
    protected adminSupplyService: AdminSupplyService = new AdminSupplyService(),
    protected supplyService: SupplyService = new SupplyService()
  ) {}

  public async create(req: Request, res: Response): Promise<void> {
    const body: AdminSupplyWriteRequestBody = req.body;
    let supply: Supply;

    try {
      supply = await this.adminSupplyService.create(body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send(supply);
  }

  public async getMany(req: Request, res: Response): Promise<void> {
    res.send(await this.adminSupplyService.getAdminSupplies());
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const foundSupply: Supply = await this.adminSupplyService.getAdminSupply(req.params.id ? +req.params.id : null);

    if (!foundSupply) {
      res.status(404).send();
      return;
    }

    res.send(foundSupply);
  }

  public async patch(req: Request, res: Response): Promise<void> {
    const body: AdminSupplyWriteRequestBody = req.body;

    try {
      await this.adminSupplyService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }

  public async patchOrderItemId(req: Request, res: Response): Promise<void> {
    const body: AdminSupplyOrderItemIdWriteRequestBody = req.body;

    try {
      await this.supplyService.adminChangeOrderItemId(req.params.id ? +req.params.id : null, body.orderItemId);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }
}
