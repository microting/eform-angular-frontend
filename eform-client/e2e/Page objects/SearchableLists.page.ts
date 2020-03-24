import {PageWithNavbarPage} from './PageWithNavbar.page';

export class SearchableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get items(): number {
    return $$('//app-entity-search-edit//ul//li').length;
  }
  getFirstRowObject(): SearchableListRowObject {
    return new SearchableListRowObject(1);
  }
  getFirstItemObject(): EntitySearchItemRowObject {
    return new EntitySearchItemRowObject(1);
  }
  public get firstEntityItemName() {
    return $(`//app-entity-search-edit//ul//li[1]//div[2]`);
  }
  public get createEntitySearchBtn() {
    return $('#createEntitySearchBtn');
  }
  public get entitySearchSearchField() {
    return $('#labelInput');
  }
  public get entitySearchCreateName() {
    return $('#createName');
  }
  public get entitySearchCreateImportBtn() {
    return $('#importEntitySearchBtn');
  }
  public get entitySearchCreateSingleItemBtn() {
    return $('#addSingleEntitySearchableItem');
  }
  public get entitySearchCreateSingleItemEditBtn() {
    return $('#entitySearchCreateSingleItemEdit');
  }
  public get entitySearchCreateItemNameBox() {
    return $(`//app-entity-search-create//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
  }
  public get entitySearchCreateItemSaveBtn() {
    return $(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
  }
  public get entitySearchCreateItemCancelBtn() {
    return $(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
  }
  public get entitySearchCreateImportItemTextArea() {
    return $(`//app-entity-search-create//app-entity-search-import-list//textarea`);
  }
  public get entitySearchCreateImportItemSaveBtn() {
    return $(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
  }
  public get entitySearchCreateImportItemCancelBtn() {
    return $(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
  }
  public get entitySearchCreateSaveBtn() {
    return $('#entitySearchCreateSaveBtn');
  }
  public get entitySearchCreateCancelBtn() {
    return $('#entitySearchCreateCancelBtn');
  }
  public get entitySearchEditBtn() {
    return $('#entitySearchUpdateBtn');
  }
  public get entitySearchEditNameBox() {
    return $('#editName');
  }
  public get entitySearchEditImportBtn() {
    return $('#editEntitySearchImportBtn');
  }
  public get entitySearchEditSingleItemBtn() {
    return $('#editEntitySearchCreateItem');
  }
  public get entitySearchItemEditBtn() {
    return $(`//app-entity-search-edit//ul//li[1]//div[3]//a[1]`);
  }
  public get entitySearchItemDeleteBtn() {
    return $(`//app-entity-search-edit//ul//li[1]//div[3]//a[2]`);
  }
  public get entitySearchEditItemNameBox() {
    return $(`//app-entity-search-edit//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
  }
  public get entitySearchEditItemSaveBtn() {
    return $(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
  }
  public get entitySearchEditItemCancelBtn() {
    return $(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
  }
  public get entitySearchEditImportItemTextArea() {
    return $(`//app-entity-search-edit//app-entity-search-import-list//textarea`);
  }
  public get entitySearchEditImportItemSaveBtn() {
    return $(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
  }
  public get entitySearchEditImportItemCancelBtn() {
    return $(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
  }
  public get entitySearchEditSaveBtn() {
    return $('#entitySearchUpdateSaveBtn');
  }
  public get entitySearchEditCancelBtn() {
    return $('#entitySearchUpdateCancelBtn');
  }
  public get entitySearchDeleteBtn() {
    return $('#entitySearchDeleteBtn');
  }
  public get entitySearchDeleteDeleteBtn() {
    return $('#entitySearchDeleteDeleteBtn');
  }
  public get entitySearchDeleteCancelBtn() {
    return $('#entitySearchDeleteCancelBtn');
  }
  public goToEntitySearchPage() {
    this.Navbar.goToEntitySearch();
  }
  public createSearchableList_NoItem(name: string) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(4000);
    this.entitySearchCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_OneItem(name, itemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(2000);
    this.entitySearchCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySearchCreateSingleItemEditBtn.click();
    browser.pause(2000);
    this.entitySearchCreateItemNameBox.addValue(itemName);
    this.entitySearchCreateItemSaveBtn.click();
    browser.pause(4000);
    this.entitySearchCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_MultipleItems(name, itemNames) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(2000);
    this.entitySearchCreateImportBtn.click();
    browser.pause(1000);
    this.entitySearchCreateImportItemTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySearchCreateImportItemSaveBtn.click();
    browser.pause(4000);
    this.entitySearchCreateSaveBtn.click();
    browser.pause(4000);
  }

  public createSearchableList_NoItem_Cancels(name) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(4000);
    this.entitySearchCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_OneItem_Cancels(name, itemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(2000);
    this.entitySearchCreateSingleItemBtn.click();
    browser.pause(1000);
    this.entitySearchCreateSingleItemEditBtn.click();
    browser.pause(1000);
    this.entitySearchCreateItemNameBox.addValue(itemName);
    this.entitySearchCreateItemSaveBtn.click();
    browser.pause(4000);
    this.entitySearchCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_MultipleItems_Cancels(name, itemNames) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed(20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(2000);
    this.entitySearchCreateImportBtn.click();
    browser.pause(1000);
    this.entitySearchCreateImportItemTextArea.addValue(itemNames);
    browser.pause(2000);
    this.entitySearchCreateImportItemSaveBtn.click();
    browser.pause(4000);
    this.entitySearchCreateCancelBtn.click();
    browser.pause(4000);
  }

  public editSearchableListNameOnly(newName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameOnly_Cancels(newName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem(newName, newItemName) {
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListOnlyItem(newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_Cancels(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_CancelsBoth(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_CancelsItemName(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteItemFromList() {
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(200000);
    this.deleteItem();
    browser.pause(1000);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      browser.pause(8000);
      deleteList.deleteBtn.click();
      browser.pause(4000);
      this.entitySearchDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
  public editItemName(newItemName) {
    this.entitySearchItemEditBtn.click();
    browser.pause(4000);
    this.entitySearchEditItemNameBox.clearElement();
    this.entitySearchEditItemNameBox.addValue(newItemName);
    this.entitySearchEditItemSaveBtn.click();
    browser.pause(2000);
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    $('#entityItemEditNameBox').waitForDisplayed(20000);
    this.entitySearchEditItemNameBox.clearElement();
    this.entitySearchEditItemNameBox.addValue(newItemName);
    this.entitySearchEditItemSaveBtn.click();
    browser.pause(2000);
  }
  public deleteItem() {
    this.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
  }
  public cleanup() {
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      browser.pause(8000);
      deleteObject.deleteBtn.click();
      browser.pause(4000);
      this.entitySearchDeleteDeleteBtn.click();
      browser.pause(1000);
      browser.refresh();
    }
  }
}

export class SearchableListRowObject {
  constructor(rowNumber) {
    if ($$('#entitySearchMUid')[rowNumber - 1]) {
      this.id = $$('#entitySearchMUid')[rowNumber - 1];
      try {
        this.name = $$('#entitySearchName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySearchUpdateBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySearchDeleteBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  id;
  name;
  editBtn;
  deleteBtn;
}
export class EntitySearchItemRowObject {
  constructor(rowNumber) {
    if ($$('#entitySearchItemEditNameentityItemUId')[rowNumber - 1]) {
     this.id = $$('#entitySearchItemEditNameentityItemUId')[rowNumber - 1];
      this.name = $$('#entitySearchItemEditNameentityItemUId')[rowNumber - 1].getText();
      try {
        this.editBtn = $$('#entitySearchEditItemEditBtn')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySearchEditItemDeleteBtn')[rowNumber - 1];
      } catch (e) {}
    }
  }
  id;
  name;
  editBtn;
  deleteBtn;
}

const searchableLists = new SearchableListsPage();
export default searchableLists;
