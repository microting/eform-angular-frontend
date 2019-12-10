import {PageWithNavbarPage} from './PageWithNavbar.page';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get items(): number {
    return $$('//app-entity-select-edit//ul//li').length;
  }
  public get entitySelectCreateBtn() {
    return browser.element('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return browser.element('#labelInput');
  }

  public get entitySelectCreateName() {
    return browser.element('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    return browser.element('#importEntitySelectBtn');
  }

  public get entitySelectCreateItemListName() {
    return browser.element('#createEntityItemName');
  }
  public get entitySelectCreateSingleItemBtn() {
    return browser.element('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSingleItemEditBtn() {
    return browser.element('#entitySelectCreateSingleItemEdit');
  }

  public get entitySelectCreateSaveBtn() {
    return browser.element('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    return browser.element('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditBtn() {
    return browser.element('#entitySelectEditBtn');
  }

  public get entitySelectDeleteBtn() {
    return browser.element('#entitySelectDeleteBtn');
  }

  public get entitySelectEditName() {
    return browser.element('#editName');
  }

  public get entitySelectEditImportListBtn() {
    return browser.element('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return browser.element('#editEntitySelectCreateItem');
  }

  public get entitySelectEditItemName() {
    return browser.element('#entitySelectItemEditName{id}');
  }

  public get entitySelectEditSaveBtn() {
    return browser.element('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    return browser.element('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    return browser.element('#entityImportTextArea');
  }
  public get entitySelectImportTextAreaEdit() {
    return browser.element(`//app-entity-select-edit//textarea`);
  }
  public get entitySelectImportSaveBtn() {
    return browser.element('#entityImportSaveBtn');
  }
  public get entitySelectImportEditSaveBtn() {
    return browser.element(`//app-entity-select-edit//app-entity-select-import-list//button[1]`);
  }
  public get  entitySelectImportCancelBtn() {
    return browser.element('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    return browser.element('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return browser.element('#entitySelectDeleteCancelBtn');
  }

  public get entitySelectEditItemNameBox() {
    return browser.element('#entitySelectItemEditNameBox');
  }

  public get entitySelectEditItemSaveBtn() {
    return browser.element('#entitySelectItemSaveBtn');
  }

  public get entitySelectEditItemCancelBtn() {
    return browser.element('#entitySelectItemCancelBtn');
  }

  public get firstEntityItemName() {
    return browser.element(`//app-entity-select-edit//ul//li[1]//div[2]`);
  }
  public get entityItemEditBtn() {
    return browser.element('#entitySelectEditItemEditBtn');
  }
  public get entityItemDeleteBtn() {
    return browser.element('//app-entity-select-edit//ul//li[1]//div[3]//a[2]');
  }

  public get entityItemEditNameBox() {
    return browser.element(`//app-entity-select-edit//input[@id= 'entitySelectItemEditNameBox']`);
  }

  public get entityItemList() {
    return browser.element(`//app-entity-select-edit//ul`);
  }
  public get entityItemEditSaveBtn() {
    return browser.element(`//app-entity-select-edit//button[@id= 'entitySelectItemSaveBtn']`);
  }
  public get entityItemEditCancelBtn() {
    return browser.element(`//app-entity-select-edit//button[@id= 'entitySelectItemCancelBtn']`);
  }
  getFirstRowObject(): SelectableListRowObject {
    return new SelectableListRowObject(1);
  }
  getFirstItemObject(): EntitySelectItemRowObject {
    return new EntitySelectItemRowObject(1);
  }
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }
  public createSelectableList_NoItem(name: string) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_OneItem(name, itemName) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_MultipleItems(name, itemNames) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateSaveBtn.click();
    browser.pause(4000);
  }

  public createSelectableList_NoItem_Cancels(name) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_OneItem_Cancels(name, itemName) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySelectCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSelectableList_MultipleItems_Cancels(name, itemNames) {
    this.entitySelectCreateBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(2000);
    this.entitySelectCreateImportListBtn.click();
    browser.pause(1000);
    this.entitySelectImportTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySelectImportSaveBtn.click();
    browser.pause(4000);
    this.entitySelectCreateCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameOnly(newName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameOnly_Cancels(newName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem(newName, newItemName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListOnlyItem(newItemName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_Cancels(newName, newItemName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_CancelsBoth(newName, newItemName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSelectableListNameAndItem_CancelsItemName(newName, newItemName) {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySelectEditName.clearElement();
    this.entitySelectEditName.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteItemFromList() {
    this.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.deleteItem();
    browser.pause(1000);
    this.entitySelectEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      browser.pause(8000);
      deleteList.deleteBtn.click();
      browser.pause(4000);
      this.entitySelectDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
  public editItemName(newItemName) {
    this.entityItemEditBtn.click();
    browser.pause(4000);
    this.entityItemEditNameBox.clearElement();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditSaveBtn.click();
    browser.pause(2000);
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    browser.waitForVisible('#entityItemEditNameBox', 20000);
    this.entityItemEditNameBox.clearElement();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditCancelBtn.click();
    browser.pause(2000);
  }
  public deleteItem() {
    this.entityItemDeleteBtn.click();
    browser.pause(2000);
  }
  public cleanup() {
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      browser.pause(8000);
      deleteObject.deleteBtn.click();
      browser.pause(4000);
      this.entitySelectDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
}
const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectMicrotingUUID')[rowNumber - 1]) {
      this.id = $$('#entitySelectMicrotingUUID')[rowNumber - 1];
      try {
        this.name = $$('#entitySelectName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectDeleteBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySelectEditBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  id;
  name;
  editBtn;
  deleteBtn;
}
export class EntitySelectItemRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectItemEditNameentityItemUId')[rowNumber - 1]) {
      this.name = $$('#entitySelectItemEditNameentityItemUId')[rowNumber - 1].getText();
      try {
        this.editBtn = $$('#entitySelectEditItemEditBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectEditItemDeleteBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  name;
  editBtn;
  deleteBtn;
}
