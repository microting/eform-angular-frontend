import {by, element} from 'protractor';

// returning row with some number like an object.
export function getRowObject(rowNumber: number): RowObject {
  const rowObject = new RowObject();
  // cells of the row
  rowObject.siteID = element(by.xpath(`//*[@id="simple_sites"]/tbody/tr[${rowNumber}]/td[1]`)).getText();
  rowObject.firstName = element(by.css(`#tableBody > tr:nth-child(${rowNumber}) > td:nth-child(2) > span:nth-last-child(1)`)).getText();
  rowObject.lastName = element(by.css(`#tableBody > tr:nth-child(${rowNumber}) > td:nth-child(3) > span:nth-last-child(1)`)).getText();
  rowObject.deviceId = element(by.xpath(`//*[@id="simple_sites"]/tbody/tr[${rowNumber}]/td[4]/div`)).getText();
  rowObject.otpCode = element(by.xpath(`//*[@id="simple_sites"]/tbody/tr[${rowNumber}]/td[5]/div`)).getText();
  rowObject.retrieveOtpCodeButton = rowNumber < 3 ? element(by
    .xpath(`//*[@id="simple_sites"]/tbody/tr[${rowNumber}]/td[5]/button`)) : null;

  rowObject.editButton = element(by.xpath(`//*[@id="tableBody"]/tr[${rowNumber}]/td[6]/a`));
  rowObject.deleteButton = element(by.xpath(`//*[@id="simple_sites"]/tbody/tr[${rowNumber}]/td[1]`));
  return rowObject;
}

export class RowObject {
  public siteID;
  public firstName;
  public lastName;
  public deviceId;
  public otpCode;
  public retrieveOtpCodeButton;
  public editButton;
  public deleteButton;
}
