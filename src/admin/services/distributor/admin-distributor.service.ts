import { Distributor } from '../../../entity/distributor';
import { cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb } from '../../../utils/transformation.utils';
import { AdminDistributorWriteRequestBody } from '../../rest-api/distributor.models';
import { AdminDistributorRepositoryService } from './admin-distributor-repository.service';

// TODO check why Prettier can't format longer lines
// tslint:disable:max-line-length
export class AdminDistributorService {
  public constructor(
    protected adminDistributorRepositoryService: AdminDistributorRepositoryService = new AdminDistributorRepositoryService()
  ) {}

  public async create(body: AdminDistributorWriteRequestBody): Promise<Distributor> {
    const distributor: Distributor = new Distributor();

    await this.fill(distributor, body);

    return await this.adminDistributorRepositoryService.save(distributor);
  }

  public async getAdminDistributor(id: number): Promise<Distributor> {
    return await this.adminDistributorRepositoryService.getAdminDistributor(id);
  }

  public async getAdminDistributors(): Promise<Distributor[]> {
    return await this.adminDistributorRepositoryService.getAdminDistributors();
  }

  public async patch(id: number, body: AdminDistributorWriteRequestBody): Promise<void> {
    const distributor: Distributor = await this.adminDistributorRepositoryService.getAdminDistributorWithNoRelations(
      id
    );

    await this.fill(distributor, body);

    await this.adminDistributorRepositoryService.save(distributor);
  }

  protected async fill(distributor: Distributor, body: AdminDistributorWriteRequestBody): Promise<void> {
    distributor.name = body.name ? cleanSingleLineAllowSingleSpaceTextBeforeStoringInDb(body.name) : null;
  }
}
