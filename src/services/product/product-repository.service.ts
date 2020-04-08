import { getRepository, Repository } from 'typeorm';

import { Product } from '../../entity/product';

export class ProductRepositoryService {
  public constructor(protected repository: Repository<Product> = getRepository(Product)) {}
}
