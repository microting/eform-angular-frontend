import Page from '../Page';

export class RentableItemSettingsPage extends Page {
  constructor() {
    super();
  }

  public get eFormSelector() {
    return $(`//*[@id= 'eFormId']//input`);
  }

  public get sdkSiteIdField() {
    $('#sdkSiteIds').waitForDisplayed({timeout: 20000});
    $('#sdkSiteIds').waitForClickable({timeout: 20000});
    return $('#sdkSiteIds');
  }

  public get saveBtn() {
    $('#saveBtn').waitForDisplayed({timeout: 20000});
    $('#saveBtn').waitForClickable({timeout: 20000});
    return $('#saveBtn');
  }
}

const rentableItemsSettingsPage = new RentableItemSettingsPage();
export default rentableItemsSettingsPage;
