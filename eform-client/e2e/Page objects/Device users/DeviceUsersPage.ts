import {$, $$, browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {OtpModal} from './otp.modal';
import {AddNewUserModal} from './add-new-user.modal';
import data from '../../data';
import {getRowObject, RowObject} from './row-object';
import {DeleteModal} from './delete.modal';
import {waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';


export class DeviceUsersPage {

  // modal windows
  OTPModal: OtpModal;
  addNewUserModal: AddNewUserModal;
  deleteModal: DeleteModal;
  // elements
  newDeviceUserButton: ElementFinder;
  deleteUserButton: ElementFinder;
  lastUser: RowObject;

  // actions
  async getRowsNumber(): Promise<number> {
    return await $$(data.DeviceUsersPage.rowCountSelector).count();
  }

  async usersCleanup(): Promise<void> {
    let startNum = await this.getRowsNumber();
    for (let i = 0; i < startNum - 2;  i++) {
      // while (startNum > 2) {
      await waitTillVisibleAndClick(this.deleteUserButton);
      await waitTillVisibleAndClick(this.deleteModal.okButton);
      startNum = await this.getRowsNumber();
    }
    // return;
  }

  constructor() {
    this.newDeviceUserButton = $('#newDeviceUserButton');
    this.deleteUserButton = element(by.xpath(data.DeviceUsersPage.deleteUserXPath));
    this.OTPModal = new OtpModal();
    this.addNewUserModal = new AddNewUserModal();
    this.deleteModal = new DeleteModal();
  }
}
