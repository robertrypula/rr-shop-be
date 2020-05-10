import { Request, Response } from 'express';

import { Distributor } from '../../entity/distributor';
import { AdminDistributorWriteRequestBody } from '../rest-api/distributor.models';
import { AdminDistributorService } from '../services/distributor/admin-distributor.service';

export class AdminDistributorController {
  public constructor(protected adminDistributorService: AdminDistributorService = new AdminDistributorService()) {}

  public async createDistributor(req: Request, res: Response): Promise<void> {
    const body: AdminDistributorWriteRequestBody = req.body;
    let distributor: Distributor;

    try {
      distributor = await this.adminDistributorService.create(body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send(distributor);
  }

  public async getDistributors(req: Request, res: Response): Promise<void> {
    res.send(await this.adminDistributorService.getAdminDistributors());
  }

  public async getDistributor(req: Request, res: Response): Promise<void> {
    const foundDistributor: Distributor = await this.adminDistributorService.getAdminDistributor(
      req.params.id ? +req.params.id : null
    );

    if (!foundDistributor) {
      res.status(404).send();
      return;
    }

    res.send(foundDistributor);
  }

  public async patchDistributor(req: Request, res: Response): Promise<void> {
    const body: AdminDistributorWriteRequestBody = req.body;

    try {
      await this.adminDistributorService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }
}
