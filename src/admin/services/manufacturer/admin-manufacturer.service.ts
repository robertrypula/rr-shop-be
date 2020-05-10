import { Manufacturer } from '../../../entity/manufacturer';
import { AdminManufacturerWriteRequestBody } from '../../rest-api/manufacturer.models';
import { AdminManufacturerRepositoryService } from './admin-manufacturer-repository.service';

// TODO check why Prettier can't format longer lines
// tslint:disable:max-line-length
export class AdminManufacturerService {
  public constructor(
    protected adminManufacturerRepositoryService: AdminManufacturerRepositoryService = new AdminManufacturerRepositoryService()
  ) {}

  public async create(body: AdminManufacturerWriteRequestBody): Promise<Manufacturer> {
    const manufacturer: Manufacturer = new Manufacturer();

    await this.fill(manufacturer, body);

    return await this.adminManufacturerRepositoryService.save(manufacturer);
  }

  public async getAdminManufacturer(id: number): Promise<Manufacturer> {
    return await this.adminManufacturerRepositoryService.getAdminManufacturer(id);
  }

  public async getAdminManufacturers(): Promise<Manufacturer[]> {
    return await this.adminManufacturerRepositoryService.getAdminManufacturers();
  }

  public async patch(id: number, body: AdminManufacturerWriteRequestBody): Promise<void> {
    const manufacturer: Manufacturer = await this.adminManufacturerRepositoryService.getAdminManufacturerWithNoRelations(
      id
    );

    await this.fill(manufacturer, body);

    await this.adminManufacturerRepositoryService.save(manufacturer);
  }

  protected async fill(manufacturer: Manufacturer, body: AdminManufacturerWriteRequestBody): Promise<void> {
    manufacturer.name = body.name;
  }
}
