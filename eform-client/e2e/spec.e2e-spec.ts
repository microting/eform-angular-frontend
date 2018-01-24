///<reference path="Page objects/LoginPage.ts"/>
import {browser, by, element, ExpectedConditions, $} from 'protractor';
import {default as data} from './data';
import {SettingsPage} from './Page objects/SettingsPage';
import {LoginPage} from './Page objects/LoginPage';
import {MainPage} from './Page objects/MainPage';

const loginPage: LoginPage = new LoginPage();
const mainPage: MainPage = new MainPage();
const settingsPage: SettingsPage = new SettingsPage();


describe('Header image button', () => {
  it('should hide logo in header', (done) => {

    browser.get('/');
    loginPage.usernameInput.sendKeys(data.login);
    loginPage.passwordInput.sendKeys(data.password);
    loginPage.loginButton.click();
    mainPage.advancedButton.click();
    mainPage.settingsButton.click();
    expect(element(settingsPage.headerImageMatcher).isDisplayed()).toBeTruthy();
    settingsPage.SiteHeader.logoButton.click();
    settingsPage.saveButton.click();
    browser.refresh();
    expect(browser.isElementPresent(settingsPage.headerImageMatcher)).toBeFalsy();
    settingsPage.SiteHeader.resetButton.click();
    done();
  });
});
