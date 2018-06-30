import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {LoginPage} from '../Page objects/LoginPage';
import {default as data} from '../data';
import {Navbar} from '../Page objects/Navbar';

const loginPage = new LoginPage();
const navbar = new Navbar();

export function waitTillVisibleAndClick(element): void {
  browser.waitForAngular();
  browser.wait(ExpectedConditions.visibilityOf(element));
  element.click();
}

export function getToPage(page) {
  browser.get(data.startPageUrl);
  loginPage.login();
  waitTillVisibleAndClick(page);
}

export function signOut() {
  browser.waitForAngular();
  navbar.signOutDropdown.click();
  browser.waitForAngular();
  navbar.signOutButton.click();
  browser.wait(ExpectedConditions.elementToBeClickable(loginPage.loginButton));
}

export function waitFor(element) {
  browser.wait(ExpectedConditions.elementToBeClickable(element));
}

export async function getStringsFromXpath(xpath, arr) {
  const x = element.all(by.xpath(xpath));
  for (let i = 0; i < await x.count(); i++) {
    const item = x.get(i);
    arr.push(await item.getText());
  }
}
