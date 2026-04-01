import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

export class SearchableListsPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public async rowNum(): Promise<number> {
    await this.page.waitForTimeout(250);
    return await this.page.locator('tbody > tr').count();
  }

  public async items(): Promise<number> {
    await this.page.waitForTimeout(250);
    return await this.page.locator('//app-entity-search-edit//ul//li').count();
  }

  async getFirstRowObject(): Promise<SearchableListRowObject> {
    await this.page.waitForTimeout(500);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const obj = new SearchableListRowObject(this.page);
      const row = await obj.getRow(i);
      if (row.name !== 'Device users') {
        return row;
      }
    }
    // Fallback to row 1 if all rows are 'Device users' (shouldn't happen)
    const obj = new SearchableListRowObject(this.page);
    return await obj.getRow(1);
  }

  async getFirstItemObject(): Promise<EntitySearchItemRowObject> {
    await this.page.waitForTimeout(250);
    const obj = new EntitySearchItemRowObject(this.page);
    return await obj.getRow(1);
  }

  public firstEntityItemName(): Locator {
    return this.page.locator(`.createEntityItemName`).first();
  }

  public createEntitySearchBtn(): Locator {
    return this.page.locator('#createEntitySearchBtn');
  }

  public entitySearchSearchField(): Locator {
    return this.page.locator('#labelInput');
  }

  public entitySearchCreateName(): Locator {
    return this.page.locator('#editName');
  }

  public entitySearchCreateImportBtn(): Locator {
    return this.page.locator('#editEntitySearchImportBtn');
  }

  public entitySearchCreateSingleItemBtn(): Locator {
    return this.page.locator('#addSingleEntitySelectableItem');
  }

  public entitySearchCreateSingleItemEditBtn(): Locator {
    return this.page.locator('.entityItemEditBtn').first();
  }

  public entitySearchCreateItemNameBox(): Locator {
    return this.page.locator('#entityItemEditNameBox');
  }

  public entitySearchCreateItemSaveBtn(): Locator {
    return this.page.locator('#entityItemSaveBtn');
  }

  public entitySearchCreateItemCancelBtn(): Locator {
    return this.page.locator('#entityItemCancelBtn');
  }

  public entitySearchCreateImportItemTextArea(): Locator {
    return this.page.locator('#entityImportTextArea');
  }

  public entitySearchCreateImportItemSaveBtn(): Locator {
    return this.page.locator('#entityImportSaveBtn');
  }

  public entitySearchCreateImportItemCancelBtn(): Locator {
    return this.page.locator(`#entityImportCancelBtn`);
  }

  public entitySearchCreateSaveBtn(): Locator {
    return this.page.locator('#entityCreateSaveBtn');
  }

  public entitySearchCreateCancelBtn(): Locator {
    return this.page.locator('#entitySearchUpdateCancelBtn');
  }

  public async entitySearchEditBtn(i = 0): Promise<Locator> {
    await this.page.waitForTimeout(250);
    await this.openRowMenu(i);
    await this.page.waitForTimeout(250);
    const btn = this.page.locator(`#entitySearchUpdateBtn${i}`);
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    return btn;
  }

  public entitySearchEditNameBox(): Locator {
    return this.page.locator('#editName');
  }

  public entitySearchEditImportBtn(): Locator {
    return this.page.locator('#editEntitySearchImportBtn');
  }

  public entitySearchEditSingleItemBtn(): Locator {
    return this.page.locator('#editEntitySearchCreateItem');
  }

  public entitySearchItemEditBtn(): Locator {
    return this.page.locator(`.entityItemEditBtn`).first();
  }

  public entitySearchItemDeleteBtn(): Locator {
    return this.page.locator(`.entityItemDeleteBtn`).first();
  }

  public entitySearchEditItemNameBox(): Locator {
    return this.page.locator(`#entityItemEditNameBox`);
  }

  public entitySearchEditItemSaveBtn(): Locator {
    return this.page.locator(`#entityItemSaveBtn`);
  }

  public entitySearchEditItemCancelBtn(): Locator {
    return this.page.locator(`#entityItemCancelBtn`);
  }

  public entitySearchEditImportItemTextArea(): Locator {
    return this.page.locator(`#entityImportTextArea`);
  }

  public entitySearchEditImportItemSaveBtn(): Locator {
    return this.page.locator(`#entityImportSaveBtn`);
  }

  public entitySearchEditImportItemCancelBtn(): Locator {
    return this.page.locator('#entityImportCancelBtn');
  }

  public entitySearchEditSaveBtn(): Locator {
    return this.page.locator('#entityUpdateSaveBtn');
  }

  public entitySearchEditCancelBtn(): Locator {
    return this.page.locator('#entitySearchUpdateCancelBtn');
  }

  public async entitySearchDeleteBtn(i = 0): Promise<Locator> {
    const btn = this.page.locator(`#entitySearchDeleteBtn${i}`);
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    return btn;
  }

  public entitySearchDeleteDeleteBtn(): Locator {
    return this.page.locator('#entitySearchDeleteDeleteBtn');
  }

  public entitySearchDeleteCancelBtn(): Locator {
    return this.page.locator('#entitySearchDeleteCancelBtn');
  }

  public async goToEntitySearchPage() {
    await this.Navbar.goToEntitySearch();
  }

  public async createSearchableList_NoItem(name: string) {
    await this.createEntitySearchBtn().click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 40000 });
    await this.entitySearchCreateName().fill(name);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSaveBtn().click();
    await this.waitForSpinnerHide();
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
    await this.page.waitForTimeout(1500);
  }

  public async createSearchableList_OneItem(name: string, itemName: string) {
    await this.createEntitySearchBtn().click();
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 400 });
    await this.entitySearchCreateName().fill(name);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSingleItemBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSingleItemEditBtn().click();
    await this.entitySearchCreateItemNameBox().fill(itemName);
    await this.entitySearchCreateItemSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
    await this.page.waitForTimeout(1500);
  }

  public async createSearchableList_MultipleItems(name: string, itemNames: string | string[]) {
    await this.createEntitySearchBtn().click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 400 });
    await this.entitySearchCreateName().fill(name);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportItemTextArea().click();
    const text = Array.isArray(itemNames) ? itemNames.join('') : itemNames;
    await this.page.keyboard.type(text);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportItemSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
    await this.page.waitForTimeout(1500);
  }

  public async createSearchableList_NoItem_Cancels(name: string) {
    await this.createEntitySearchBtn().click();
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 400 });
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateName().fill(name);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateCancelBtn().click();
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
    await this.page.waitForTimeout(250);
  }

  public async createSearchableList_OneItem_Cancels(name: string, itemName: string) {
    await this.createEntitySearchBtn().click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 400 });
    await this.entitySearchCreateName().fill(name);
    await this.entitySearchCreateSingleItemBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateSingleItemEditBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateItemNameBox().fill(itemName);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateItemSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateCancelBtn().click();
    await this.page.waitForTimeout(250);
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
    await this.page.waitForTimeout(1500);
  }

  public async createSearchableList_MultipleItems_Cancels(name: string, itemNames: string | string[]) {
    await this.createEntitySearchBtn().click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 400 });
    await this.entitySearchCreateName().fill(name);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportItemTextArea().click();
    const text = Array.isArray(itemNames) ? itemNames.join('') : itemNames;
    await this.page.keyboard.type(text);
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateImportItemSaveBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySearchCreateCancelBtn().click();
    await this.page.waitForTimeout(250);
    await this.createEntitySearchBtn().waitFor({ state: 'visible', timeout: 90000 });
  }

  public async editSearchableListNameOnly(newName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditSaveBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListNameOnly_Cancels(newName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditCancelBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListNameAndItem(newName: string, newItemName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200000 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    await this.editItemName(newItemName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditSaveBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListOnlyItem(newItemName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.editItemName(newItemName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditSaveBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListNameAndItem_Cancels(newName: string, newItemName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    await this.editItemName(newItemName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditCancelBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListNameAndItem_CancelsBoth(newName: string, newItemName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    await this.editItemName_Cancels(newItemName);
    await this.page.waitForTimeout(250);
    await this.entitySearchEditCancelBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async editSearchableListNameAndItem_CancelsItemName(newName: string, newItemName: string) {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.entitySearchEditNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditNameBox().fill(newName);
    await this.editItemName_Cancels(newItemName);
    await this.entitySearchEditSaveBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async deleteItemFromList() {
    let rowNumber = await this.rowNum();
    rowNumber = rowNumber - 1;
    await (await this.entitySearchEditBtn(rowNumber)).click();
    await this.page.waitForTimeout(250);
    await this.page.locator('#editName').waitFor({ state: 'visible', timeout: 200 });
    await this.deleteItem();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditSaveBtn().click();
    await this.page.waitForTimeout(250);
  }

  public async deleteList() {
    const row = await this.getFirstRowObject();
    if (!row?.index) return;

    const index = row.index - 1;

    await this.page.locator(`#action-items${index}`).scrollIntoViewIfNeeded();

    await this.page.waitForTimeout(250);
    await this.openRowMenu(index);
    await this.page.waitForTimeout(250);

    const deleteBtn = await this.entitySearchDeleteBtn(index);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();

    const confirm = this.entitySearchDeleteDeleteBtn();
    await confirm.waitFor({ state: 'visible', timeout: 5000 });
    await confirm.click();

    await this.waitForSpinnerHide();
  }

  public async editItemName(newItemName: string) {
    await this.entitySearchItemEditBtn().click();
    await this.entitySearchEditItemNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditItemNameBox().fill(newItemName);
    await this.entitySearchEditItemSaveBtn().click();
  }

  public async editItemName_Cancels(newItemName: string) {
    const firstItem = await this.getFirstItemObject();
    await firstItem.editBtn.click();
    await this.page.locator('#entityItemEditNameBox').waitFor({ state: 'visible', timeout: 400 });
    await this.entitySearchEditItemNameBox().clear();
    await this.page.waitForTimeout(250);
    await this.entitySearchEditItemNameBox().fill(newItemName);
    await this.entitySearchEditItemSaveBtn().click();
  }

  public async deleteItem() {
    await this.entitySearchItemDeleteBtn().click();
  }

  public async openRowMenu(i = 0) {
    const menuBtn = this.page.locator(`#actionMenu${i}`);
    await menuBtn.waitFor({ state: 'visible', timeout: 1000 });
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }

  public async cleanup() {
    const row = await this.getFirstRowObject();
    if (!row?.deleteBtn) return;

    await this.openRowMenu(row.index - 1);

    await row.deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await row.deleteBtn.click();

    const confirm = this.entitySearchDeleteDeleteBtn();
    await confirm.waitFor({ state: 'visible', timeout: 5000 });
    await confirm.click();

    await this.waitForSpinnerHide();
  }
}

export class SearchableListRowObject {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;
  id: Locator;
  name: string;
  editBtn: Locator;
  deleteBtn: Locator;
  index: number;

  async getRow(rowNum: number): Promise<SearchableListRowObject> {
    this.index = rowNum;
    const i = rowNum - 1;
    const id = `#entitySearchMUid-${i}`;
    if ((await this.page.locator(id).count()) >= 1) {
      this.id = this.page.locator(`#entitySearchMUid-${i}`);
      try {
        this.name = (await this.page.locator(`#entitySearchName-${i}`).textContent() || '').trim();
      } catch (e) {}
      try {
        this.editBtn = this.page.locator(`#entitySearchUpdateBtn${rowNum - 1}`);
      } catch (e) {}
      try {
        this.deleteBtn = this.page.locator(`#entitySearchDeleteBtn${rowNum - 1}`);
      } catch (e) {}
    }
    return this;
  }
}

export class EntitySearchItemRowObject {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;
  id: Locator;
  name: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number): Promise<EntitySearchItemRowObject> {
    if ((await this.page.locator('#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)).count()) > 0) {
      this.id = this.page.locator('#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)).first();
      this.name = await this.page.locator('#entitySearchItemEditNameentityItemUId_' + (rowNum - 1)).first().textContent() || '';
      try {
        this.editBtn = this.page.locator('#entitySearchEditItemEditBtn_' + (rowNum - 1)).first();
      } catch (e) {
      }
      try {
        this.deleteBtn = this.page.locator('#entitySearchEditItemDeleteBtn_' + (rowNum - 1)).first();
      } catch (e) {
      }
    }
    return this;
  }
}
