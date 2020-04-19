import { Request, Response } from 'express';

import { Product } from '../../entity/product';
import { ProductService } from '../../services/product/product.service';

export class AdminProductController {
  public constructor(protected productService: ProductService = new ProductService()) {}

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
}
