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
    $('#entitySelectCreateBtn').waitForDisplayed(20000);
    return $('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return $('#labelInput');
  }

  public get entitySelectCreateName() {
    $('#createName').waitForDisplayed(20000);
    return $('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    $('#importEntitySelectBtn').waitForDisplayed(20000);
    return $('#importEntitySelectBtn');
  }

  public get entitySelectCreateItemListName() {
    return $('#createEntityItemName');
  }
  public get entitySelectCreateSingleItemBtn() {
    $('#addSingleEntitySelectableItem').waitForDisplayed(20000);
    return $('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSingleItemEditBtn() {
    $('#entitySelectCreateSingleItemEdit').waitForDisplayed(20000);
    return $('#entitySelectCreateSingleItemEdit');
  }

  public get entitySelectCreateSaveBtn() {
    $('#createEntitySelectSaveBtn').waitForDisplayed(20000);
    return $('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    $('#createEntitySelectCancelBtn').waitForDisplayed(20000);
    return $('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditBtn() {
    $('#entitySelectEditBtn_0').waitForDisplayed(20000);
    $('#entitySelectEditBtn_0').waitForClickable({timeout: 20000});
    return $('#entitySelectEditBtn_0');
  }

  public get entitySelectDeleteBtn() {
    return $('#entitySelectDeleteBtn');
  }

  public get entitySelectEditName() {
    $('#editName').waitForDisplayed(20000);
    return $('#editName');
  }

  public get entitySelectEditImportListBtn() {
    $('#editEntitySelectImportBtn').waitForDisplayed(20000);
    return $('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return $('#editEntitySelectCreateItem');
  }

  public get entitySelectEditItemName() {
    return $('#entitySelectItemEditName{id}');
  }

  public get entitySelectEditSaveBtn() {
    $('#editEntitySelectSaveBtn').waitForDisplayed(20000);
    $('#editEntitySelectSaveBtn').waitForClickable({ timeout: 20000});
    return $('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    $('#editEntitySelectCancelBtn').waitForDisplayed(20000);
    $('#editEntitySelectCancelBtn').waitForClickable({ timeout: 20000});
    return $('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    $('#entityImportTextArea').waitForDisplayed(20000);
    return $('#entityImportTextArea');
  }
  public get entitySelectImportTextAreaEdit() {
    const ele = $(`//app-entity-select-edit//textarea`);
    ele.waitForDisplayed(20000);
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySelectImportSaveBtn() {
    return $('#entityImportSaveBtn');
  }
  public get entitySelectImportEditSaveBtn() {
    return $(`//app-entity-select-edit//app-entity-select-import-list//button[1]`);
  }
  public get  entitySelectImportCancelBtn() {
    return $('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    $('#entitySelectDeleteDeleteBtn').waitForDisplayed(20000);
    return $('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return $('#entitySelectDeleteCancelBtn');
  }

  public get entitySelectEditItemNameBox() {
    $('#entitySelectItemEditNameBox').waitForDisplayed(20000);
    return $('#entitySelectItemEditNameBox');
  }

  public get entitySelectEditItemSaveBtn() {
    $('#entitySelectItemSaveBtn').waitForDisplayed(20000);
    return $('#entitySelectItemSaveBtn');
  }

  public get entitySelectEditItemCancelBtn() {
    return $('#entitySelectItemCancelBtn');
  }

  public get firstEntityItemName() {
    return $(`//app-entity-select-edit//ul//li[1]//div[2]`);
  }
  public get entityItemEditBtn() {
    return $('#entitySelectEditItemEditBtn');
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
    return new SelectableListRowObject(1);
  }
  getFirstItemObject(): EntitySelectItemRowObject {
    return new EntitySelectItemRowObject(1);
  }
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }
  public createSelectableList_NoItem(name: string) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public createSelectableList_OneItem(name, itemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public createSelectableList_MultipleItems(name, itemNames) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    browser.pause(1000);
    this.entitySelectCreateImportListBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectImportTextArea.addValue(itemNames);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectImportSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }

  public createSelectableList_NoItem_Cancels(name) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public createSelectableList_OneItem_Cancels(name, itemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectEditItemNameBox.addValue(itemName);
    this.entitySelectEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public createSelectableList_MultipleItems_Cancels(name, itemNames) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectCreateBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySelectCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateImportListBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectImportTextArea.addValue(itemNames);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectImportSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameOnly(newName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameOnly_Cancels(newName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameAndItem(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    $('#editName').waitForClickable({timeout: 200000});
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListOnlyItem(newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.editItemName(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameAndItem_Cancels(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.editItemName(newItemName);
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameAndItem_CancelsBoth(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editSelectableListNameAndItem_CancelsItemName(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySelectEditName.clearValue();
    this.entitySelectEditName.addValue(newName);
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.editItemName_Cancels(newItemName);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public deleteItemFromList() {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.deleteItem();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entitySelectEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      $('#spinner-animation').waitForDisplayed(90000, true);
      deleteList.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed(90000, true);
      this.entitySelectDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed(90000, true);
    }
  }
  public editItemName(newItemName) {
    this.entityItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    this.entityItemEditNameBox.waitForDisplayed(20000);
    this.entityItemEditNameBox.waitForClickable({timeout: 20000});
    this.entityItemEditNameBox.clearValue();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    $('#entityItemEditNameBox').waitForDisplayed(20000);
    this.entityItemEditNameBox.clearValue();
    this.entityItemEditNameBox.addValue(newItemName);
    this.entityItemEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public deleteItem() {
    this.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  }
  public cleanup() {
    $('#entitySelectDeleteBtn_0').waitForDisplayed(20000);
    $('#entitySelectDeleteBtn_0').waitForClickable({timeout: 20000});
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed(90000, true);
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed(90000, true);
      this.entitySelectDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed(90000, true);
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
