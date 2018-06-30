// these functions navigate user from login page to another page
import {LoginPage} from '../Page objects/LoginPage';
import {waitTillVisibleAndClick} from './other-helper-methods';
import {Navbar} from '../Page objects/Navbar';
import {browser} from 'protractor';
import data from '../data';

const loginPage = new LoginPage();
const navbar = new Navbar();

export function goToSettingsPage() {
  browser.get(data.startPageUrl);
  loginPage.login();
  waitTillVisibleAndClick(navbar.advancedButton);
  waitTillVisibleAndClick(navbar.settingsButton);
}

export function goToDeviceUsersPage() {
  browser.get(data.startPageUrl);
  loginPage.login();
  waitTillVisibleAndClick(navbar.deviceUsersButton);
}

export function goToMainPage() {
  browser.get(data.startPageUrl);
  loginPage.login();
  browser.waitForAngular();
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
