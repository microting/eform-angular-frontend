import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {LoginPage} from '../Page objects/LoginPage';
import {Navbar} from '../Page objects/Navbar';


export function waitTillVisibleAndClick(element: ElementFinder): void {
  browser.waitForAngular();
  browser.wait(ExpectedConditions.visibilityOf(element));
  element.click();
}

export function signOut() {
  const loginPage = new LoginPage();
  const navbar = new Navbar();
  // browser.waitForAngular();
  // browser.wait(ExpectedConditions.elementToBeClickable(navbar.signOutButton));
  // browser.wait(ExpectedConditions.elementToBeClickable(navbar.signOutButton));
  // navbar.signOutDropdown.click();
  // browser.waitForAngular();
  // navbar.signOutButton.click();
  // browser.wait(ExpectedConditions.elementToBeClickable(loginPage.loginButton));
  browser.waitForAngular();
  waitTillVisibleAndClick(navbar.signOutDropdown);
  browser.waitForAngular();
  waitTillVisibleAndClick(navbar.signOutButton);
  waitTillVisibleAndClick(loginPage.loginButton);
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
