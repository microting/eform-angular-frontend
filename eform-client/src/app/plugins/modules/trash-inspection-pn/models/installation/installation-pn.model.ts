import { DeployCheckbox, SiteNameDto } from 'src/app/common/models';

export class InstallationsPnModel {
  total: number;
  installationList: Array<InstallationPnModel> = [];
}

export class InstallationPnModel {
  id: number;
  name: string;
  SdkSiteIds: Array<number> = [];
  deployedSites: Array<SiteNameDto>;
  deployCheckboxes: Array<DeployCheckbox> = [];
}
