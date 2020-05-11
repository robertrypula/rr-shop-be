import { Request, Response } from 'express';

import { Manufacturer } from '../../entity/manufacturer';
import { AdminManufacturerWriteRequestBody } from '../rest-api/manufacturer.models';
import { AdminManufacturerService } from '../services/manufacturer/admin-manufacturer.service';

export class AdminManufacturerController {
  public constructor(protected adminManufacturerService: AdminManufacturerService = new AdminManufacturerService()) {}

  public async createManufacturer(req: Request, res: Response): Promise<void> {
    const body: AdminManufacturerWriteRequestBody = req.body;
    let manufacturer: Manufacturer;

    try {
      manufacturer = await this.adminManufacturerService.create(body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send(manufacturer);
  }

  public async getManufacturers(req: Request, res: Response): Promise<void> {
    res.send(await this.adminManufacturerService.getAdminManufacturers());
  }

  public async getManufacturer(req: Request, res: Response): Promise<void> {
    const foundManufacturer: Manufacturer = await this.adminManufacturerService.getAdminManufacturer(
      req.params.id ? +req.params.id : null
    );

    if (!foundManufacturer) {
      res.status(404).send();
      return;
    }

    res.send(foundManufacturer);
  }

  public async patchManufacturer(req: Request, res: Response): Promise<void> {
    const body: AdminManufacturerWriteRequestBody = req.body;

    try {
      await this.adminManufacturerService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }
}
