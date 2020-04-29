import { Request, Response } from 'express';

import { Product } from '../../entity/product';
import { ProductService } from '../../services/product/product.service';
import { AdminProductPatch } from '../rest-api/product.models';
import { AdminProductService } from '../services/product/admin-product.service';

export class AdminProductController {
  public constructor(
    protected productService: ProductService = new ProductService(),
    protected adminProductService: AdminProductService = new AdminProductService()
  ) {}

  public async getProducts(req: Request, res: Response): Promise<void> {
    res.send(await this.productService.getAdminProducts());
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const foundProduct: Product = await this.productService.getAdminProduct(req.params.id ? +req.params.id : null);

    if (!foundProduct) {
      res.status(404).send();
      return;
    }

    res.send(foundProduct);
  }

  public async patchProduct(req: Request, res: Response): Promise<void> {
    const body: AdminProductPatch = req.body;

    try {
      await this.adminProductService.patch(req.params.id ? +req.params.id : null, body);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
      return;
    }

    res.status(204).send();
  }
}
