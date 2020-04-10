import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { Product } from '../entity/product';
import { FetchType, ParameterBag } from '../models/product.models';
import { ProductService } from '../services/product/product.service';

/*
  Where in:
    https://github.com/typeorm/typeorm/issues/1239
    https://github.com/typeorm/typeorm/issues/2135
*/

export class ProductController {
  public constructor(
    protected repository: Repository<Product> = getRepository(Product),
    protected productService: ProductService = new ProductService()
  ) {}

  public async getCashRegisterCvs(req: Request, res: Response): Promise<void> {
    // TODO find more REST approach (it's not returning JSON and violates REST endpoint structure)
    // TODO move it to product.service.ts / product-repository.service
    const queryBuilder: SelectQueryBuilder<Product> = this.repository
      .createQueryBuilder('product')
      .select([
        ...['id', 'externalId', 'nameCashRegister', 'priceUnit'].map(c => `product.${c}`),
        ...['id', 'vat'].map(c => `supplies.${c}`)
      ])
      .leftJoin('product.supplies', 'supplies');

    res.contentType('text/csv; charset=utf-8').send(
      (await queryBuilder.getMany())
        .map((product: Product): string => {
          const priceUnitScaled = Math.round(product.priceUnit * 100);
          let vatNumber: number;
          let vat = 'D';

          if (product.supplies && product.supplies.length > 0) {
            vatNumber = Math.round(product.supplies[0].vat);
            switch (vatNumber) {
              case 23:
                vat = 'A';
                break;
              case 8:
                vat = 'B';
                break;
              case 5:
                vat = 'C';
                break;
            }
          }

          return [
            ...[product.externalId, product.nameCashRegister, vat],
            ...['1', '2', '1', 'N', '0000000000000'],
            priceUnitScaled,
            ...['N', 'N', 'N', 'N', '0']
          ].join(';');
        })
        .join('\n')
    );
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);
    let productIds: number[] = null;

    try {
      if (parameterBag.categoryIds) {
        productIds = await this.productService.getProductsIdsByCategoryIds(parameterBag.categoryIds);
      } else if (parameterBag.productIds) {
        productIds = parameterBag.productIds;
      } else if (parameterBag.name) {
        productIds = await this.productService.getProductsIdsByName(parameterBag.name);
      }

      res.send(await this.productService.getProductsByFetchType(productIds, parameterBag.fetchType));
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
    }
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);

    try {
      const product: Product[] = await this.productService.getProductsByFetchType(
        [parameterBag.productId],
        parameterBag.fetchType
      );

      if (product.length === 1) {
        res.send(product[0]);
      } else {
        res.status(404);
      }
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
    }
  }

  // ---------------------------------------------------------------------------

  protected getParameterBag(req: Request): ParameterBag {
    return {
      categoryIds: this.getIdsAsArray(req, 'categoryIds'),
      fetchType: this.getFetchType(req),
      name: req.query.name ? req.query.name : null,
      productId: req.params.id ? +req.params.id : null,
      productIds: this.getIdsAsArray(req, 'productIds')
    };
  }

  protected getIdsAsArray(req: Request, field: string): number[] {
    return typeof req.query[field] !== 'undefined'
      ? req.query[field] === ''
        ? []
        : req.query[field].split(',').map((categoryId: string): number => +categoryId)
      : null;
  }

  protected getFetchType(req: Request): FetchType {
    switch (req.query.fetchType) {
      case 'minimal':
        return FetchType.Minimal;
      case 'medium':
        return FetchType.Medium;
      case 'full':
        return FetchType.Full;
    }

    return null;
  }
}
