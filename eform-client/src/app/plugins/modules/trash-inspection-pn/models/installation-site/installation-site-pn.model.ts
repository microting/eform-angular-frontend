export class InstallationSitesPnModel {
  total: number;
  installationSiteList: Array<InstallationSitePnModel> = [];
}

export class InstallationSitePnModel {
  installationId: number;
  sdkSiteId: number;
}
