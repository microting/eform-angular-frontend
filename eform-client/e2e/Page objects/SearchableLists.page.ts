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
    return browser.element(`//app-entity-search-edit//ul//li[1]//div[2]`);
  }
  public get createEntitySearchBtn() {
    return browser.element('#createEntitySearchBtn');
  }
  public get entitySearchSearchField() {
    return browser.element('#labelInput');
  }
  public get entitySearchCreateName() {
    return browser.element('#createName');
  }
  public get entitySearchCreateImportBtn() {
    return browser.element('#importEntitySearchBtn');
  }
  public get entitySearchCreateSingleItemBtn() {
    return browser.element('#addSingleEntitySearchableItem');
  }
  public get entitySearchCreateSingleItemEditBtn() {
    return browser.element('#entitySearchCreateSingleItemEdit');
  }
  public get entitySearchCreateItemNameBox() {
    return browser.element(`//app-entity-search-create//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
  }
  public get entitySearchCreateItemSaveBtn() {
    return browser.element(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
  }
  public get entitySearchCreateItemCancelBtn() {
    return browser.element(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
  }
  public get entitySearchCreateImportItemTextArea() {
    return browser.element(`//app-entity-search-create//app-entity-search-import-list//textarea`);
  }
  public get entitySearchCreateImportItemSaveBtn() {
    return browser.element(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
  }
  public get entitySearchCreateImportItemCancelBtn() {
    return browser.element(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
  }
  public get entitySearchCreateSaveBtn() {
    return browser.element('#entitySearchCreateSaveBtn');
  }
  public get entitySearchCreateCancelBtn() {
    return browser.element('#entitySearchCreateCancelBtn');
  }
  public get entitySearchEditBtn() {
    return browser.element('#entitySearchUpdateBtn');
  }
  public get entitySearchEditNameBox() {
    return browser.element('#editName');
  }
  public get entitySearchEditImportBtn() {
    return browser.element('#editEntitySearchImportBtn');
  }
  public get entitySearchEditSingleItemBtn() {
    return browser.element('#editEntitySearchCreateItem');
  }
  public get entitySearchItemEditBtn() {
    return browser.element(`//app-entity-search-edit//ul//li[1]//div[3]//a[1]`);
  }
  public get entitySearchItemDeleteBtn() {
    return browser.element(`//app-entity-search-edit//ul//li[1]//div[3]//a[2]`);
  }
  public get entitySearchEditItemNameBox() {
    return browser.element(`//app-entity-search-edit//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
  }
  public get entitySearchEditItemSaveBtn() {
    return browser.element(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
  }
  public get entitySearchEditItemCancelBtn() {
    return browser.element(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
  }
  public get entitySearchEditImportItemTextArea() {
    return browser.element(`//app-entity-search-edit//app-entity-search-import-list//textarea`);
  }
  public get entitySearchEditImportItemSaveBtn() {
    return browser.element(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
  }
  public get entitySearchEditImportItemCancelBtn() {
    return browser.element(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
  }
  public get entitySearchEditSaveBtn() {
    return browser.element('#entitySearchUpdateSaveBtn');
  }
  public get entitySearchEditCancelBtn() {
    return browser.element('#entitySearchUpdateCancelBtn');
  }
  public get entitySearchDeleteBtn() {
    return browser.element('#entitySearchDeleteBtn');
  }
  public get entitySearchDeleteDeleteBtn() {
    return browser.element('#entitySearchDeleteDeleteBtn');
  }
  public get entitySearchDeleteCancelBtn() {
    return browser.element('#entitySearchDeleteCancelBtn');
  }
  public goToEntitySearchPage() {
    this.Navbar.goToEntitySearch();
  }
  public createSearchableList_NoItem(name: string) {
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(4000);
    this.entitySearchCreateSaveBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_OneItem(name, itemName) {
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
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
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
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
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
    this.entitySearchCreateName.addValue(name);
    browser.pause(4000);
    this.entitySearchCreateCancelBtn.click();
    browser.pause(4000);
  }
  public createSearchableList_OneItem_Cancels(name, itemName) {
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
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
    this.createEntitySearchBtn.click();
    browser.waitForVisible('#createName', 20000);
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
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameOnly_Cancels(newName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem(newName, newItemName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListOnlyItem(newItemName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_Cancels(newName, newItemName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName(newItemName);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_CancelsBoth(newName, newItemName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditCancelBtn.click();
    browser.pause(4000);
  }
  public editSearchableListNameAndItem_CancelsItemName(newName, newItemName) {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
    this.entitySearchEditNameBox.clearElement();
    this.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditSaveBtn.click();
    browser.pause(4000);
  }
  public deleteItemFromList() {
    this.entitySearchEditBtn.click();
    browser.waitForVisible('#editName', 200000);
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
    browser.waitForVisible('#entityItemEditNameBox', 20000);
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
