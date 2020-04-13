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
    browser.pause(500);
    return new SearchableListRowObject(1);
  }
  getFirstItemObject(): EntitySearchItemRowObject {
    browser.pause(500);
    return new EntitySearchItemRowObject(1);
  }
  public get firstEntityItemName() {
    const ele = $(`//app-entity-search-edit//ul//li[1]//div[2]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
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
    const ele = $('#importEntitySearchBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateSingleItemBtn() {
    return $('#addSingleEntitySearchableItem');
  }
  public get entitySearchCreateSingleItemEditBtn() {
    return $('#entitySearchCreateSingleItemEdit');
  }
  public get entitySearchCreateItemNameBox() {
    const ele = $(`//app-entity-search-create//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateItemSaveBtn() {
    const ele = $(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateItemCancelBtn() {
    const ele = $(`//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateImportItemTextArea() {
    const ele = $(`//app-entity-search-create//app-entity-search-import-list//textarea`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateImportItemSaveBtn() {
    const ele = $(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateImportItemCancelBtn() {
    const ele = $(`//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateSaveBtn() {
    const ele = $('#entitySearchCreateSaveBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchCreateCancelBtn() {
    const ele = $('#entitySearchCreateCancelBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
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
    const ele = $(`//app-entity-search-edit//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditItemSaveBtn() {
    const ele = $(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditItemCancelBtn() {
    const ele = $(`//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditImportItemTextArea() {
    const ele = $(`//app-entity-search-edit//app-entity-search-import-list//textarea`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditImportItemSaveBtn() {
    const ele = $(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditImportItemCancelBtn() {
    const ele = $(`//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditSaveBtn() {
    const ele = $('#entitySearchUpdateSaveBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchEditCancelBtn() {
    const ele = $('#entitySearchUpdateCancelBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchDeleteBtn() {
    const ele = $('#entitySearchDeleteBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchDeleteDeleteBtn() {
    const ele = $('#entitySearchDeleteDeleteBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }
  public get entitySearchDeleteCancelBtn() {
    return $('#entitySearchDeleteCancelBtn');
  }
  public goToEntitySearchPage() {
    this.Navbar.goToEntitySearch();
  }
  public createSearchableList_NoItem(name: string) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSearchableList_OneItem(name, itemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateItemNameBox.addValue(itemName);
    this.entitySearchCreateItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSearchableList_MultipleItems(name, itemNames) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    this.entitySearchCreateImportBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateImportItemTextArea.addValue(itemNames);
    this.entitySearchCreateImportItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public createSearchableList_NoItem_Cancels(name) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSearchableList_OneItem_Cancels(name, itemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSingleItemBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateSingleItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateItemNameBox.addValue(itemName);
    this.entitySearchCreateItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public createSearchableList_MultipleItems_Cancels(name, itemNames) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.createEntitySearchBtn.click();
    $('#createName').waitForDisplayed({timeout: 20000});
    this.entitySearchCreateName.addValue(name);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateImportBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateImportItemTextArea.addValue(itemNames);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateImportItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public editSearchableListNameOnly(newName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListNameOnly_Cancels(newName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListNameAndItem(newName, newItemName) {
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListOnlyItem(newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.editItemName(newItemName);
    this.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListNameAndItem_Cancels(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName(newItemName);
    this.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListNameAndItem_CancelsBoth(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editSearchableListNameAndItem_CancelsItemName(newName, newItemName) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.entitySearchEditNameBox.clearValue();
    this.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.editItemName_Cancels(newItemName);
    this.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteItemFromList() {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({timeout: 200000});
    this.deleteItem();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteList() {
    const deleteList = this.getFirstRowObject();
    if (deleteList != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteList.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.entitySearchDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      //browser.refresh();
    }
  }
  public editItemName(newItemName) {
    this.entitySearchItemEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.entitySearchEditItemNameBox.clearValue();
    this.entitySearchEditItemNameBox.addValue(newItemName);
    this.entitySearchEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editItemName_Cancels(newItemName) {
    const firstItem = this.getFirstItemObject();
    firstItem.editBtn.click();
    $('#entityItemEditNameBox').waitForDisplayed({timeout: 20000});
    this.entitySearchEditItemNameBox.clearValue();
    this.entitySearchEditItemNameBox.addValue(newItemName);
    this.entitySearchEditItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteItem() {
    this.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public cleanup() {
    const deleteObject = this.getFirstRowObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.entitySearchDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      //browser.refresh();
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
