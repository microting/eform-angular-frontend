import Page from './Page';
import {Navbar} from './Navbar.page';
import { $ } from '@wdio/globals';

export class PageWithNavbarPage extends Page {
  constructor() {
    super();
    this.Navbar = new Navbar();
  }

  Navbar: Navbar;

}
