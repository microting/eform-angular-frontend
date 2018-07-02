import {browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {LoginPage} from '../Page objects/LoginPage';
import {Navbar} from '../Page objects/Navbar';


export async function waitTillVisibleAndClick(element: ElementFinder): Promise<void> {
  await browser.waitForAngular();
  await browser.wait(ExpectedConditions.visibilityOf(element));
  await element.click();
}

export async function signOut() {
  const loginPage = new LoginPage();
  const navbar = new Navbar();
  await browser.waitForAngular();
  await waitTillVisibleAndClick(navbar.signOutDropdown);
  await browser.waitForAngular();
  await waitTillVisibleAndClick(navbar.signOutButton);
  await waitFor(loginPage.loginButton);
}

export async function waitFor(element) {
  await browser.wait(ExpectedConditions.elementToBeClickable(element));
}

export async function getStringsFromXpath(xpath, arr) {
  const x = element.all(by.xpath(xpath));
  for (let i = 0; i < await x.count(); i++) {
    const item = x.get(i);
    arr.push(await item.getText());
  }
}
