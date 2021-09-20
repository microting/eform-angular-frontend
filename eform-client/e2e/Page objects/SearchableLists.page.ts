import { PageWithNavbarPage } from './PageWithNavbar.page';

export class SearchableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }
  public async items(): Promise<number> {
    await browser.pause(500);
    return (await $$('//app-entity-search-edit//ul//li')).length;
  }
  async getFirstRowObject(): Promise<SearchableListRowObject> {
    await browser.pause(500);
    const obj = new SearchableListRowObject();
    return await obj.getRow(1);
  }
  async getFirstItemObject(): Promise<EntitySearchItemRowObject> {
    await browser.pause(500);
    const obj = new EntitySearchItemRowObject();
    return await obj.getRow(1);
  }
  public async firstEntityItemName(): Promise<WebdriverIO.Element> {
    const ele = await $(`//app-entity-search-edit//ul//li[1]//div[2]`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async createEntitySearchBtn(): Promise<WebdriverIO.Element> {
    return $('#createEntitySearchBtn');
  }
  public async entitySearchSearchField(): Promise<WebdriverIO.Element> {
    return $('#labelInput');
  }
  public async entitySearchCreateName(): Promise<WebdriverIO.Element> {
    return $('#createName');
  }
  public async entitySearchCreateImportBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#importEntitySearchBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateSingleItemBtn(): Promise<WebdriverIO.Element> {
    return $('#addSingleEntitySearchableItem');
  }
  public async entitySearchCreateSingleItemEditBtn(): Promise<WebdriverIO.Element> {
    return $('#entitySearchCreateSingleItemEdit');
  }
  public async entitySearchCreateItemNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-import-list//textarea`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-create//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchCreateCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchUpdateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $('#editName');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportBtn(): Promise<WebdriverIO.Element> {
    return $('#editEntitySearchImportBtn');
  }
  public async entitySearchEditSingleItemBtn(): Promise<WebdriverIO.Element> {
    return $('#editEntitySearchCreateItem');
  }
  public async entitySearchItemEditBtn(): Promise<WebdriverIO.Element> {
    return $(`//app-entity-search-edit//ul//li[1]//div[3]//a[1]`);
  }
  public async entitySearchItemDeleteBtn(): Promise<WebdriverIO.Element> {
    return $(`//app-entity-search-edit//ul//li[1]//div[3]//a[2]`);
  }
  public async entitySearchEditItemNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-edit-name//input[@id= 'entitySearchItemEditNameBox']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemSaveBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-edit-name//button[@id= 'entitySearchItemCancelBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-import-list//textarea`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportSaveBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `//app-entity-search-edit//app-entity-search-import-list//button[@id= 'entitySearchImportCancelBtn']`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchUpdateSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchUpdateCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    return $('#entitySearchDeleteCancelBtn');
  }
  public async goToEntitySearchPage() {
    await this.Navbar.goToEntitySearch();
  }
  public async createSearchableList_NoItem(name: string) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await (await $('#createName')).waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_OneItem(name, itemName) {
    (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await $('#createName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSingleItemBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSingleItemEditBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateItemNameBox()).setValue(itemName);
    await (await this.entitySearchCreateItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_MultipleItems(name, itemNames) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await $('#createName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await (await this.entitySearchCreateImportBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateImportItemTextArea()).setValue(itemNames);
    await (await this.entitySearchCreateImportItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }

  public async createSearchableList_NoItem_Cancels(name) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await $('#createName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_OneItem_Cancels(name, itemName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await $('#createName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSingleItemBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateSingleItemEditBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateItemNameBox()).setValue(itemName);
    await (await this.entitySearchCreateItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_MultipleItems_Cancels(name, itemNames) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.createEntitySearchBtn()).click();
    await $('#createName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateImportBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateImportItemTextArea()).setValue(itemNames);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateImportItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchCreateCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }

  public async editSearchableListNameOnly(newName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListNameOnly_Cancels(newName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchEditCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListNameAndItem(newName, newItemName) {
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await $('#editName').waitForClickable({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await this.editItemName(newItemName);
    await (await this.entitySearchEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListOnlyItem(newItemName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await this.editItemName(newItemName);
    await (await this.entitySearchEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListNameAndItem_Cancels(newName, newItemName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await this.editItemName(newItemName);
    await (await this.entitySearchEditCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListNameAndItem_CancelsBoth(newName, newItemName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await this.editItemName_Cancels(newItemName);
    await (await this.entitySearchEditCancelBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editSearchableListNameAndItem_CancelsItemName(newName, newItemName) {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await this.editItemName_Cancels(newItemName);
    await (await this.entitySearchEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async deleteItemFromList() {
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.entitySearchEditBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await this.deleteItem();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async deleteList() {
    const deleteList = await this.getFirstRowObject();
    if (deleteList != null) {
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      await deleteList.deleteBtn.click();
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      await (await this.entitySearchDeleteDeleteBtn()).click();
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      // browser.refresh();
    }
  }
  public async editItemName(newItemName) {
    await (await this.entitySearchItemEditBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await (await this.entitySearchEditItemNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditItemNameBox()).setValue(newItemName);
    await (await this.entitySearchEditItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async editItemName_Cancels(newItemName) {
    const firstItem = await this.getFirstItemObject();
    await firstItem.editBtn.click();
    await $('#entityItemEditNameBox').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchEditItemNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditItemNameBox()).setValue(newItemName);
    (await await this.entitySearchEditItemSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async deleteItem() {
    await (await this.entitySearchItemDeleteBtn()).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
  public async cleanup() {
    const deleteObject = await this.getFirstRowObject();
    if (deleteObject != null) {
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      await deleteObject.deleteBtn.click();
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      await (await this.entitySearchDeleteDeleteBtn()).click();
      await $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
      // browser.refresh();
    }
  }
}

export class SearchableListRowObject {
  constructor() {}
  id;
  name;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number): Promise<SearchableListRowObject> {
    if (await ($$('#entitySearchMUid'))[rowNum - 1]) {
      this.id = (await $$('#entitySearchMUid'))[rowNum - 1];
      try {
        this.name = await (await $$('#entitySearchName'))[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = (await $$('#entitySearchUpdateBtn'))[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = (await $$('#entitySearchDeleteBtn'))[rowNum - 1];
      } catch (e) {}
    }
    return this;
  }
}
export class EntitySearchItemRowObject {
  constructor() {
  }
  id;
  name;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number): Promise<EntitySearchItemRowObject> {
    if ((await $$('#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)))[0]) {
      this.id = (await $$(
        '#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)
      ))[0];
      this.name = await (await $$(
        '#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)
      ))[0].getText();
      try {
        this.editBtn = (await $$('#entitySearchEditItemEditBtn_' + (rowNum - 1)))[0];
      } catch (e) {}
      try {
        this.deleteBtn = (await $$(
          '#entitySearchEditItemDeleteBtn_' + (rowNum - 1)
        ))[0];
      } catch (e) {}
    }
    return this;
  }
}

const searchableLists = new SearchableListsPage();
export default searchableLists;
