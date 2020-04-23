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
    $('#entitySelectCreateBtn').waitForDisplayed({timeout: 20000});
    return $('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return $('#labelInput');
  }

  public get entitySelectCreateName() {
    $('#createName').waitForDisplayed({timeout: 20000});
    return $('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    $('#importEntitySelectBtn').waitForDisplayed({timeout: 20000});
    return $('#importEntitySelectBtn');
  }

  public get entitySelectCreateItemListName() {
    return $('#createEntityItemName');
  }
  public get entitySelectCreateSingleItemBtn() {
    $('#addSingleEntitySelectableItem').waitForDisplayed({timeout: 20000});
    return $('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSingleItemEditBtn() {
    $('#entitySelectCreateSingleItemEdit').waitForDisplayed({timeout: 20000});
    return $('#entitySelectCreateSingleItemEdit');
  }

  public get entitySelectCreateSaveBtn() {
    $('#createEntitySelectSaveBtn').waitForDisplayed({timeout: 20000});
    return $('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    $('#createEntitySelectCancelBtn').waitForDisplayed({timeout: 20000});
    return $('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditBtn() {
    $('#entitySelectEditBtn_0').waitForDisplayed({timeout: 20000});
    $('#entitySelectEditBtn_0').waitForClickable({timeout: 20000});
    return $('#entitySelectEditBtn_0');
  }

  public get entitySelectDeleteBtn() {
    return $('#entitySelectDeleteBtn');
  }

  public get entitySelectEditName() {
    $('#editName').waitForDisplayed({timeout: 20000});
    return $('#editName');
  }

  public get entitySelectEditImportListBtn() {
    $('#editEntitySelectImportBtn').waitForDisplayed({timeout: 20000});
    return $('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return $('#editEntitySelectCreateItem');
  }

  public get entitySelectEditItemName() {
    return $('#entitySelectItemEditName{id}');
  }

  public get entitySelectEditSaveBtn() {
    $('#editEntitySelectSaveBtn').waitForDisplayed({timeout: 20000});
    $('#editEntitySelectSaveBtn').waitForClickable({ timeout: 20000});
    return $('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    $('#editEntitySelectCancelBtn').waitForDisplayed({timeout: 20000});
    $('#editEntitySelectCancelBtn').waitForClickable({ timeout: 20000});
    return $('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    $('#entityImportTextArea').waitForDisplayed({timeout: 20000});
    return $('#entityImportTextArea');
  }
  public get entitySelectImportTextAreaEdit() {
    const ele = $(`//app-entity-select-edit//textarea`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySelectImportSaveBtn() {
    return $('#entityImportSaveBtn');
  }
  public get entitySelectImportEditSaveBtn() {
    const ele = $(`//app-entity-select-edit//app-entity-select-import-list//button[1]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get  entitySelectImportCancelBtn() {
    return $('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    $('#entitySelectDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    return $('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return $('#entitySelectDeleteCancelBtn');
  }

  public get entitySelectEditItemNameBox() {
    $('#entitySelectItemEditNameBox').waitForDisplayed({timeout: 20000});
    return $('#entitySelectItemEditNameBox');
  }

  public get entitySelectEditItemSaveBtn() {
    $('#entitySelectItemSaveBtn').waitForDisplayed({timeout: 20000});
    return $('#entitySelectItemSaveBtn');
  }

  public get entitySelectEditItemCancelBtn() {
    return $('#entitySelectItemCancelBtn');
  }

  public get firstEntityItemName() {
    return $(`//app-entity-select-edit//ul//li[1]//div[2]`);
  }
  public get entityItemEditBtn() {
    const ele = $('#entitySelectEditItemEditBtn_0');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get entityItemDeleteBtn() {
    return $('//app-entity-select-edit//ul//li[1]//div[3]//a[2]');
  }

  public get entityItemEditNameBox() {
    return $(`//app-entity-select-edit//input[@id= 'entitySelectItemEditNameBox']`);
  }

  public get entityItemList() {
    return $(`//app-entity-select-edit//ul`);
  }
  public get entityItemEditSaveBtn() {
    return $(`//app-entity-select-edit//button[@id= 'entitySelectItemSaveBtn']`);
  }
  public get entityItemEditCancelBtn() {
    return $(`//app-entity-select-edit//button[@id= 'entitySelectItemCancelBtn']`);
  }
  getFirstRowObject(): SelectableListRowObject {
    browser.pause(500);
    return new SelectableListRowObject(1);
  }
  getFirstItemObject(): EntitySelectItemRowObject {
    browser.pause(500);
    return new EntitySelectItemRowObject(1);
  }
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }
  public createSelectableList_NoItem(name: string) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSelectableList_OneItem(name, itemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSelectableList_MultipleItems(name, itemNames) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    browser.pause(1000);
    this.entitySelectCreateImportListBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectImportTextArea.addValue(itemNames);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectImportSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public createSelectableList_NoItem_Cancels(name) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSelectableList_OneItem_Cancels(name, itemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSelectableList_MultipleItems_Cancels(name, itemNames) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateImportListBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectImportTextArea.addValue(itemNames);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectImportSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameOnly(newName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameOnly_Cancels(newName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameAndItem(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    $('#editName').waitForClickable({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    // $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListOnlyItem(newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameAndItem_Cancels(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName(newItemName);
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameAndItem_CancelsBoth(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSelectableListNameAndItem_CancelsItemName(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteItemFromList() {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.deleteItem();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteList.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.entitySelectDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }
  public editItemName(newItemName) {
    this.entityItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entityItemEditNameBox.waitForDisplayed({timeout: 20000});
    this.entityItemEditNameBox.waitForClickable({timeout: 20000});
    this.entityItemEditNameBox.clearValue();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    $('#entityItemEditNameBox').waitForDisplayed({timeout: 20000});
    this.entityItemEditNameBox.clearValue();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteItem() {
    this.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public cleanup() {
    $('#entitySelectDeleteBtn_0').waitForDisplayed({timeout: 20000});
    $('#entitySelectDeleteBtn_0').waitForClickable({timeout: 20000});
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.entitySelectDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }
}
const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor(rowNumber) {
    if ($$('#entitySelectMicrotingUUID_' + (rowNumber - 1))[0]) {
      this.id = $$('#entitySelectMicrotingUUID_' + (rowNumber - 1))[0];
      try {
        this.name = $$('#entitySelectName_' + (rowNumber - 1))[0].getText();
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectDeleteBtn_' + (rowNumber - 1))[0];
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySelectEditBtn_' + (rowNumber - 1))[0];
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
    if ($$('#entitySelectItemEditNameentityItemUId_' + (rowNumber - 1))[0]) {
      this.name = $$('#entitySelectItemEditNameentityItemUId_' + (rowNumber - 1))[0].getText();
      try {
        this.editBtn = $$('#entitySelectEditItemEditBtn_' + (rowNumber - 1))[0];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectEditItemDeleteBtn_' + (rowNumber - 1))[0];
      } catch (e) {}
    }
  }
  name;
  editBtn;
  deleteBtn;
}
