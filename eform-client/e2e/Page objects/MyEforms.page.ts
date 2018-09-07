import {PageWithNavbarPage} from './PageWithNavbar.page';

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public getRowNum(): number {

    return 10;
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor() {

  }

  id: number;
  createdAt: Date;
  firstName;
  lastName;
  tags: string[];
  pairingBtn;
}
