import { Request, Response } from 'express';

import { Image } from '../../entity/image';
import { AdminImageWriteRequestBody } from '../rest-api/image.models';
import { AdminImageService } from '../services/image/admin-image.service';

export class AdminImageController {
  public constructor(protected adminImageService: AdminImageService = new AdminImageService()) {}

  public async createImage(req: Request, res: Response): Promise<void> {
    const body: AdminImageWriteRequestBody = req.body;
    let image: Image;

    try {
      image = await this.adminImageService.create(body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(200).send(image);
  }

  public async getImages(req: Request, res: Response): Promise<void> {
    res.send(await this.adminImageService.getAdminImages());
  }

  public async getImage(req: Request, res: Response): Promise<void> {
    const foundImage: Image = await this.adminImageService.getAdminImage(req.params.id ? +req.params.id : null);

    if (!foundImage) {
      res.status(404).send();
      return;
    }

    res.send(foundImage);
  }

  public async patchImage(req: Request, res: Response): Promise<void> {
    const body: AdminImageWriteRequestBody = req.body;

    try {
      await this.adminImageService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }
}
