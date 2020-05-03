import { getRepository, Repository } from 'typeorm';

import { LogSearch } from '../../entity/log-search';

export class LogSearchRepositoryService {
  public constructor(protected repository: Repository<LogSearch> = getRepository(LogSearch)) {}

  public async save(logSearch: LogSearch): Promise<LogSearch> {
    return await this.repository.save(logSearch);
  }
}
