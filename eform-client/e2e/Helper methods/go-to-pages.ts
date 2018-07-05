// these functions navigate user from login page to another page
import {LoginPage} from '../Page objects/LoginPage';
import {waitTillVisibleAndClick} from './other-helper-methods';
import {Navbar} from '../Page objects/Navbar';
import {browser} from 'protractor';
import data from '../data';

const loginPage = new LoginPage();
const navbar = new Navbar();

export async function goToSettingsPage() {
  await browser.get(data.startPageUrl);
  loginPage.login();
  await waitTillVisibleAndClick(navbar.advancedButton);
  await waitTillVisibleAndClick(navbar.settingsButton);
}

export async function goToDeviceUsersPage() {
  await browser.get(data.startPageUrl);
  await loginPage.login();
  await waitTillVisibleAndClick(navbar.deviceUsersButton);
}

export async function goToMainPage() {
  await browser.get(data.startPageUrl);
  await loginPage.login();
  await browser.waitForAngular();
  await browser.sleep(5000);
  // waitTillVisibleAndClick(navbar.mainPageButton);
}

export function gotToSites() {

}

export function gotToWorkers() {

}

export function gotToUnits() {

}

export function gotToSearchableList() {

}

export function gotSelectableList() {

}

export function gotToUserManagement() {

}

export function gotToGoogleAuthenticator() {

}

export function goToChangePassword() {

}
