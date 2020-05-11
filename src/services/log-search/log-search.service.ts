import { LogSearch } from '../../entity/log-search';
import { ProductsRatingMap } from '../../models/product.models';
import { LogSearchRepositoryService } from './log-search-repository.service';

export class LogSearchService {
  public constructor(
    protected logSearchRepositoryService: LogSearchRepositoryService = new LogSearchRepositoryService()
  ) {}

  public async logSearch(ip: string, query: string, productsRatingMap: ProductsRatingMap): Promise<void> {
    await this.save(
      new LogSearch()
        .setIp(ip)
        .setQuery(query)
        .setResultCount(Object.keys(productsRatingMap).length)
    );

    return null;
  }

  public async save(logSearch: LogSearch): Promise<LogSearch> {
    return await this.logSearchRepositoryService.save(logSearch);
  }
}
