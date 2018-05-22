import {$, $$, browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {OtpModal} from './otp.modal';
import {AddNewUserModal} from './add-new-user.modal';
import data from '../../data';
import {getRowObject, RowObject} from './row-object';
import {DeleteModal} from './delete.modal';


export class DeviceUsersPage {

  // modal windows
  OTPModal = new OtpModal();
  addNewUserModal = new AddNewUserModal();
  deleteModal = new DeleteModal();
  // elements
  newDeviceUserButton: ElementFinder;
  deleteUserButton: ElementFinder;
  lastUser: RowObject;

  // actions
  async getRowsNumber() {
    return $$(data.DeviceUsersPage.rowCountSelector).count();
  }

  async usersCleanup() {
    let startNum = await this.getRowsNumber();
    while (startNum > 2) {
      this.deleteUserButton.click();
      this.deleteModal.okButton.click();
      startNum = await this.getRowsNumber();
    }
    return;
  }

  constructor() {
    this.newDeviceUserButton = $('#newDeviceUserButton');
    this.deleteUserButton = element(by.xpath(data.DeviceUsersPage.deleteUserXPath));
  }
}
