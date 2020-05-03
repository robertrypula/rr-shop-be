import { Request, Response } from 'express';
import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from '../entity/product';
import { Supply } from '../entity/supply';
import { getProductsRatingMapFromProductIds } from '../mappers/product.mappers';
import { FetchType, ParameterBag, ProductsRatingMap, Type } from '../models/product.models';
import { ProductService } from '../services/product/product.service';
import { getCashRegisterName, getCashRegisterWindow1250Encoding } from '../utils/name.utils';
import { getFormattedDate } from '../utils/transformation.utils';
import { getUniqueValues } from '../utils/utils';

/*
  Where in:
    https://github.com/typeorm/typeorm/issues/1239
    https://github.com/typeorm/typeorm/issues/2135
*/

const getCashRegisterCsvRow = (product: Product): string => {
  const nameCashRegister: string = getCashRegisterName(product.nameCashRegister, true);

  if (nameCashRegister !== product.nameCashRegister) {
    throw `Cash register name of product ${product.externalId} is not valid`;
  }

  return [
    ...[product.externalId, nameCashRegister, getCashRegisterVat(product)],
    ...['1', '2', '1', 'N', '0000000000000'],
    `${Math.round(product.priceUnit * 100)}`,
    ...['N', 'T', 'N', 'N', '0']
  ].join(';');
};

const getCashRegisterVat = (product: Product): string => {
  if (product.type !== Type.Product) {
    return 'A';
  }

  if (product.supplies && product.supplies.length > 0) {
    const vats: string[] = product.supplies.map((supply: Supply): string => `${Math.round(supply.vat)}%`);
    const uniqueVats: string[] = getUniqueValues(vats);

    if (uniqueVats.length !== 1) {
      throw `Multiple VAT issue (${uniqueVats.join(', ')}) found at product ${product.externalId}`;
    }
    /*
    console.log(
      product.externalId,
      uniqueVats.length !== 1 ? 'YES!!!!' : '       ',
      '------',
      uniqueVats.join(','),
      '------',
      vats.join(','),
      '------'
    );
    */

    switch (Math.round(product.supplies[0].vat)) {
      case 23:
        return 'A';
      case 8:
        return 'B';
      case 5:
        return 'C';
    }
  }

  throw `Cannot find supplies to check VAT for product ${product.externalId}`;
};

export class ProductController {
  public constructor(
    protected repository: Repository<Product> = getRepository(Product),
    protected productService: ProductService = new ProductService()
  ) {}

  public async getCashRegisterCsv(req: Request, res: Response): Promise<void> {
    // TODO find more REST approach (it's not returning JSON and violates REST endpoint structure)
    // TODO move it to product.service.ts / product-repository.service
    let csvWindows1250: Buffer;

    try {
      const queryBuilder: SelectQueryBuilder<Product> = this.repository
        .createQueryBuilder('product')
        .select([
          ...['id', 'externalId', 'nameCashRegister', 'priceUnit', 'type'].map(c => `product.${c}`),
          ...['id', 'vat'].map(c => `supplies.${c}`)
        ])
        .leftJoin('product.supplies', 'supplies');
      const products: Product[] = await queryBuilder.getMany();
      const csvUtf8: string = products.map((product: Product): string => getCashRegisterCsvRow(product)).join('\n');

      csvWindows1250 = getCashRegisterWindow1250Encoding(csvUtf8);
    } catch (error) {
      res.status(500).send({ error });
      return;
    }

    res
      .writeHead(200, {
        'Content-Disposition': `attachment; filename="cash_register_${getFormattedDate(new Date())}.csv"`,
        'Content-Encoding': 'windows-1250',
        'Content-Type': 'text/csv; charset=windows-1250'
      })
      .end(csvWindows1250);
  }

  public async getProducts(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);
    let products: Product[];
    let productsRatingMap: ProductsRatingMap = null;

    try {
      if (parameterBag.categoryIds) {
        productsRatingMap = await this.productService.getProductsRatingMapByCategoryIds(parameterBag.categoryIds);
      } else if (parameterBag.productIds) {
        productsRatingMap = getProductsRatingMapFromProductIds(parameterBag.productIds);
      } else if (parameterBag.query || parameterBag.query === '') {
        productsRatingMap = await this.productService.getProductsRatingMapByQuery(parameterBag.query);
      }

      products = await this.productService.getProductsByFetchType(productsRatingMap, parameterBag.fetchType);
    } catch (error) {
      res.status(500).send({ errorMessage: `${error}` });
    }

    res.send(products);
  }

  public async getProduct(req: Request, res: Response): Promise<void> {
    const parameterBag: ParameterBag = this.getParameterBag(req);

    try {
      const product: Product[] = await this.productService.getProductsByFetchType(
        getProductsRatingMapFromProductIds([parameterBag.productId]),
        parameterBag.fetchType
      );

      if (product.length === 1) {
        res.send(product[0]);
      } else {
        res.status(404).send();
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
      productId: req.params.id ? +req.params.id : null,
      productIds: this.getIdsAsArray(req, 'productIds'),
      query: typeof req.query.query !== 'undefined' ? `${req.query.query}` : null
    };
  }

  protected getIdsAsArray(req: Request, field: string): number[] {
    // TODO check req.query[field] types
    return typeof req.query[field] !== 'undefined'
      ? `${req.query[field]}` === ''
        ? []
        : `${req.query[field]}`.split(',').map((categoryId: string): number => +categoryId)
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
