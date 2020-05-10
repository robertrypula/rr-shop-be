import { Supply } from '../../../entity/supply';
import { AdminSupplyWriteRequestBody } from '../../rest-api/supply.models';
import { AdminSupplyRepositoryService } from './admin-supply-repository.service';

// TODO check why Prettier can't format longer lines
// tslint:disable:max-line-length
export class AdminSupplyService {
  public constructor(
    protected adminSupplyRepositoryService: AdminSupplyRepositoryService = new AdminSupplyRepositoryService()
  ) {}

  public async create(body: AdminSupplyWriteRequestBody): Promise<Supply> {
    const supply: Supply = new Supply();

    await this.fill(supply, body);

    return await this.adminSupplyRepositoryService.save(supply);
  }

  public async getAdminSupply(id: number): Promise<Supply> {
    return await this.adminSupplyRepositoryService.getAdminSupply(id);
  }

  public async getAdminSupplies(): Promise<Supply[]> {
    return await this.adminSupplyRepositoryService.getAdminSupplies();
  }

  public async patch(id: number, body: AdminSupplyWriteRequestBody): Promise<void> {
    const supply: Supply = await this.adminSupplyRepositoryService.getAdminSupplyWithNoRelations(id);

    await this.fill(supply, body);

    await this.adminSupplyRepositoryService.save(supply);
  }

  protected async fill(supply: Supply, body: AdminSupplyWriteRequestBody): Promise<void> {
    // TODO implement fill
  }
}
