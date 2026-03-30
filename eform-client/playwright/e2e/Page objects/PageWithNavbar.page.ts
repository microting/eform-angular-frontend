import BasePage from './Page';
import { Navbar } from './Navbar.page';
import { Page } from '@playwright/test';

export class PageWithNavbarPage extends BasePage {
  Navbar: Navbar;

  constructor(page: Page) {
    super(page);
    this.Navbar = new Navbar(page);
  }
}
