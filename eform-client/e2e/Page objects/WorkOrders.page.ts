import {PageWithNavbarPage} from './PageWithNavbar.page';
import loginPage from './Login.page';
import myEformsPage from './MyEforms.page';


class WorkOrdersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get firstWorkOrderId() {
    return $$('#workOrderId')[0].getText();
  }
  public goToWorkOrdersSettingsPage() {
    loginPage.open('/');
    myEformsPage.Navbar.goToPluginsPage();
    myEformsPage.Navbar.goToWorkOrdersSettingsPage();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
}

const workOrdersPage = new WorkOrdersPage();
export default workOrdersPage;
