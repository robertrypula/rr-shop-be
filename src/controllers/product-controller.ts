import { Request, Response } from 'express';

export class ProductController {
  public listAll(req: Request, res: Response): void {
    res.send([
      {
        id: 1,
        name: 'Product 1',
        price: 149.99
      },
      {
        id: 2,
        name: 'Product 2',
        price: 9.99
      }
    ]);
  }
}
