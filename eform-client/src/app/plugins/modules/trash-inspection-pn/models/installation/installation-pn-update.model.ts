import { SiteNameDto } from '../../../../../common/models/dto';
import { DeployCheckbox } from '../../../../../common/models/eforms';

export class InstallationPnUpdateModel {
  id: number;
  name: string;
  relatedTrashInspectionsIds: Array<number> = [];
  deployedSites: Array<SiteNameDto>;
  deployCheckboxes: Array<DeployCheckbox> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.relatedTrashInspectionsIds = data.relatedTrashInspectionsIds;
      this.deployCheckboxes = data.deployCheckboxes;
      this.deployedSites = data.deployedSites;
    }
  }
}
