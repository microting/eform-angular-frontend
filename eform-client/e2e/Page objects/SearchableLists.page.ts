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
    const row = await obj.getRow(1);
    if (row.name !== 'Device users') {
      return row;
    } else {
      return await obj.getRow(2);
    }
  }
  async getFirstItemObject(): Promise<EntitySearchItemRowObject> {
    await browser.pause(500);
    const obj = new EntitySearchItemRowObject();
    return await obj.getRow(1);
  }
  public async firstEntityItemName(): Promise<WebdriverIO.Element> {
    const ele = await $(`#createEntityItemName`);
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
    return $('#editName');
  }
  public async entitySearchCreateImportBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editEntitySearchImportBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateSingleItemBtn(): Promise<WebdriverIO.Element> {
    return $('#addSingleEntitySelectableItem');
  }
  public async entitySearchCreateSingleItemEditBtn(): Promise<WebdriverIO.Element> {
    return $('#entityItemEditBtn');
  }
  public async entitySearchCreateItemNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityItemEditNameBox');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityItemSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityItemCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityImportTextArea');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityImportSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateImportItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#entityImportCancelBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchCreateCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySearchUpdateCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditBtn(i = 0): Promise<WebdriverIO.Element> {
    const ele = await $$('#entitySearchUpdateBtn')[i];
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
    return $(`#entityItemEditBtn`);
  }
  public async entitySearchItemDeleteBtn(): Promise<WebdriverIO.Element> {
    return $(`#entityItemDeleteBtn`);
  }
  public async entitySearchEditItemNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `#entityItemEditNameBox`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `#entityItemSaveBtn`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(
      `#entityItemCancelBtn`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $(`#entityImportTextArea`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#entityImportSaveBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditImportItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityImportCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }
  public async entitySearchEditSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityUpdateSaveBtn');
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
    await (await this.createEntitySearchBtn()).click();
    await browser.pause(500);
    await (await $('#editName')).waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await browser.pause(500);
    await (await this.entitySearchCreateSaveBtn()).click();
    await browser.pause(500);
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_OneItem(name, itemName) {
    await (await this.createEntitySearchBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await browser.pause(500);
    await (await this.entitySearchCreateSingleItemBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateSingleItemEditBtn()).click();
    await (await this.entitySearchCreateItemNameBox()).setValue(itemName);
    await (await this.entitySearchCreateItemSaveBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateSaveBtn()).click();
    await browser.pause(500);
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_MultipleItems(name, itemNames) {
    await (await this.createEntitySearchBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await browser.pause(500);
    await (await this.entitySearchCreateImportBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateImportItemTextArea()).click();
    await browser.keys(itemNames);
    await browser.pause(500);
    await (await this.entitySearchCreateImportItemSaveBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateSaveBtn()).click();
    await browser.pause(500);
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }

  public async createSearchableList_NoItem_Cancels(name) {
    await (await this.createEntitySearchBtn()).click();
    await $('#editName').waitForDisplayed({ timeout: 40000 });
    await browser.pause(500);
    await (await this.entitySearchCreateName()).setValue(name);
    await browser.pause(500);
    await (await this.entitySearchCreateCancelBtn()).click();
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
    await browser.pause(500);
  }
  public async createSearchableList_OneItem_Cancels(name, itemName) {
    await (await this.createEntitySearchBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await (await this.entitySearchCreateSingleItemBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateSingleItemEditBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateItemNameBox()).setValue(itemName);
    await browser.pause(500);
    await (await this.entitySearchCreateItemSaveBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateCancelBtn()).click();
    await browser.pause(500);
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }
  public async createSearchableList_MultipleItems_Cancels(name, itemNames) {
    await (await this.createEntitySearchBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchCreateName()).setValue(name);
    await browser.pause(500);
    await (await this.entitySearchCreateImportBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateImportItemTextArea()).click();
    await browser.keys(itemNames);
    await browser.pause(500);
    await (await this.entitySearchCreateImportItemSaveBtn()).click();
    await browser.pause(500);
    await (await this.entitySearchCreateCancelBtn()).click();
    await browser.pause(500);
    await (await this.createEntitySearchBtn()).waitForDisplayed({timeout: 90000});
  }

  public async editSearchableListNameOnly(newName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await browser.pause(500);
    await (await this.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListNameOnly_Cancels(newName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await browser.pause(500);
    await (await this.entitySearchEditCancelBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListNameAndItem(newName, newItemName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForClickable({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await browser.pause(500);
    await this.editItemName(newItemName);
    await browser.pause(500);
    await (await this.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListOnlyItem(newItemName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await this.editItemName(newItemName);
    await browser.pause(500);
    await (await this.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListNameAndItem_Cancels(newName, newItemName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await browser.pause(500);
    await this.editItemName(newItemName);
    await browser.pause(500);
    await (await this.entitySearchEditCancelBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListNameAndItem_CancelsBoth(newName, newItemName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await browser.pause(500);
    await this.editItemName_Cancels(newItemName);
    await browser.pause(500);
    await (await this.entitySearchEditCancelBtn()).click();
    await browser.pause(500);
  }
  public async editSearchableListNameAndItem_CancelsItemName(newName, newItemName) {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await (await this.entitySearchEditNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditNameBox()).setValue(newName);
    await this.editItemName_Cancels(newItemName);
    await (await this.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
  }
  public async deleteItemFromList() {
    await (await this.entitySearchEditBtn()).click();
    await browser.pause(500);
    await $('#editName').waitForDisplayed({ timeout: 200000 });
    await this.deleteItem();
    await browser.pause(500);
    await (await this.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
  }
  public async deleteList() {
    const deleteList = await this.getFirstRowObject();
    if (deleteList != null) {
      await deleteList.deleteBtn.click();
      await (await this.entitySearchDeleteDeleteBtn()).click();
      // browser.refresh();
    }
  }
  public async editItemName(newItemName) {
    await (await this.entitySearchItemEditBtn()).click();
    await (await this.entitySearchEditItemNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditItemNameBox()).setValue(newItemName);
    await (await this.entitySearchEditItemSaveBtn()).click();
  }
  public async editItemName_Cancels(newItemName) {
    const firstItem = await this.getFirstItemObject();
    await firstItem.editBtn.click();
    await $('#entityItemEditNameBox').waitForDisplayed({ timeout: 40000 });
    await (await this.entitySearchEditItemNameBox()).clearValue();
    await browser.pause(500);
    await (await this.entitySearchEditItemNameBox()).setValue(newItemName);
    (await await this.entitySearchEditItemSaveBtn()).click();
  }
  public async deleteItem() {
    await (await this.entitySearchItemDeleteBtn()).click();
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
  index;

  async getRow(rowNum: number): Promise<SearchableListRowObject> {
    this.index = rowNum;
    const id = '#entitySearchMUid';
    if ((await $$(id))[rowNum - 1]) {
      this.id = (await $$('#entitySearchMUid'))[rowNum - 1];
      try {
        this.name = await (await $$('#entitySearchName'))[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = (await $$('#entitySearchUpdateBtn'))[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = (await $$('#entitySearchDeleteBtn'))[rowNum - 1];
        // console.log('rowNum is ' + rowNum + ' - ' + this.deleteBtn);
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
