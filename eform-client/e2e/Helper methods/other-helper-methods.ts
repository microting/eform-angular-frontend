import {browser, ExpectedConditions} from 'protractor';
import {LoginPage} from '../Page objects/LoginPage';
import {default as data} from '../data';
import {Navbar} from '../Page objects/Navbar';

const loginPage = new LoginPage();
const navbar = new Navbar();
const startPageUrl = data.startPageUrl;

export function waitTillVisibleAndClick(element): void {
  browser.wait(ExpectedConditions.visibilityOf(element));
  element.click();
}

export function getToPage(page) {
  browser.get(data.startPageUrl);
  loginPage.login();
  waitTillVisibleAndClick(page);
}

export function signOut() {
  navbar.signOutDropdown.click();
  navbar.signOutButton.click();
  browser.wait(ExpectedConditions.elementToBeClickable(loginPage.loginButton));
}
