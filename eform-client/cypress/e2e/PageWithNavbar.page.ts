import Page from './Page';
import {Navbar} from './Navbar.page';

export class PageWithNavbarPage extends Page {
  constructor() {
    super();
    this.Navbar = new Navbar();
  }

  Navbar: Navbar;

}
