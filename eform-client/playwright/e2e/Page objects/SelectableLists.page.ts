import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';
import { generateRandmString } from '../../e2e/Helpers/helper-functions';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public async selectableListCount(): Promise<number> {
    return await this.page.locator('tbody > tr').count();
  }

  public async openRowMenu(i = 0) {
    const menuBtn = this.page.locator(`#action-items${i} #actionMenu`);
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }

  public async itemsEditPageCount(): Promise<number> {
    let i = 0;
    let searching = true;
    while (searching) {
      const id = '#entitySelectItemEditNameentityItemUId_' + i;
      const exists = (await this.page.locator(id).count()) > 0;
      if (exists) {
        searching = false;
      } else {
        if (i === 0) {
          searching = false;
          i = -1;
        }
      }
      i++;
    }
    return i;
  }

  public async itemsCreatePageCount(): Promise<number> {
    return await this.page.locator('.createEntityItemName').count();
  }

  public entitySelectCreateBtn(): Locator {
    return this.page.locator('#entitySelectCreateBtn');
  }

  public entitySelectCreateName(): Locator {
    return this.page.locator('#editName');
  }

  public entitySelectCreateDescription(): Locator {
    return this.page.locator('#editDescription');
  }

  public entitySelectCreateImportListBtn(): Locator {
    return this.page.locator('#editEntitySearchImportBtn');
  }

  public entitySelectCreateSingleItemBtn(): Locator {
    return this.page.locator('#addSingleEntitySelectableItem');
  }

  public entitySelectCreateSaveBtn(): Locator {
    return this.page.locator('#entityCreateSaveBtn');
  }

  public entitySelectCreateCancelBtn(): Locator {
    return this.page.locator('#entitySearchUpdateCancelBtn');
  }

  public entitySelectEditName(): Locator {
    return this.page.locator('#editName');
  }

  public entitySelectEditDescription(): Locator {
    return this.page.locator('#editDescription');
  }

  public entitySelectEditImportListBtn(): Locator {
    return this.page.locator('#editEntitySearchImportBtn');
  }

  public entitySelectEditSingleItemBtn(): Locator {
    return this.page.locator('#editEntitySelectCreateItem');
  }

  public entitySelectEditSaveBtn(): Locator {
    return this.page.locator('#entityUpdateSaveBtn');
  }

  public entitySelectEditCancelBtn(): Locator {
    return this.page.locator('#entitySearchUpdateCancelBtn');
  }

  public entitySelectImportTextArea(): Locator {
    return this.page.locator('#entityImportTextArea');
  }

  public entitySelectImportSaveBtn(): Locator {
    return this.page.locator(`#entityImportSaveBtn`);
  }

  public entitySelectImportCancelBtn(): Locator {
    return this.page.locator('#entityImportCancelBtn');
  }

  public entitySelectDeleteDeleteBtn(): Locator {
    return this.page.locator('#entitySelectDeleteDeleteBtn');
  }

  public entitySelectDeleteCancelBtn(): Locator {
    return this.page.locator('#entitySelectDeleteCancelBtn');
  }

  public entitySelectEditItemNameBox(): Locator {
    return this.page.locator('#entityItemEditNameBox');
  }

  public entitySelectEditItemSaveBtn(): Locator {
    return this.page.locator('#entityItemSaveBtn');
  }

  public entitySelectEditItemCancelBtn(): Locator {
    return this.page.locator('#entityItemCancelBtn');
  }

  public async getFirstEntityItemOnEdit(): Promise<EntitySelectItemEditRowObject> {
    await this.page.waitForTimeout(250);
    const obj = new EntitySelectItemEditRowObject(this.page, this);
    return await obj.getRow(1);
  }

  public idTableHeader(): Locator {
    return this.page.locator('#idTableHeader');
  }

  public nameTableHeader(): Locator {
    return this.page.locator('#nameTableHeader');
  }

  public descriptionTableHeader(): Locator {
    return this.page.locator('#descriptionTableHeader');
  }

  public async getEntitySelectItemEditRowObjectByIndex(index: number):
    Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject(this.page, this);
    return await obj.getRow(index);
  }

  async getFirstSelectableListObject(): Promise<SelectableListRowObject> {
    const obj = new SelectableListRowObject(this.page, this);
    const row = await obj.getRow(1);
    if (row.name !== 'Device users') {
      return row;
    } else {
      return await obj.getRow(2);
    }
  }

  async getLastSelectableListObject(): Promise<SelectableListRowObject> {
    const obj = new SelectableListRowObject(this.page, this);
    return await obj.getRow(await this.selectableListCount());
  }

  async getFirstItemEditObject(): Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject(this.page, this);
    return await obj.getRow(1);
  }

  async getLastItemEditObject(): Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject(this.page, this);
    return await obj.getRow(await this.itemsEditPageCount());
  }

  async getLastItemCreateObject(): Promise<EntitySelectItemCreateRowObject> {
    const obj = new EntitySelectItemCreateRowObject(this.page, this);
    return await obj.getRow(await this.itemsCreatePageCount());
  }

  public async createDummySelectableLists(count = 3) {
    for (let i = 0; i < count; i++) {
      await this.createSelectableList({
        name: generateRandmString(),
        description: generateRandmString(),
      });
    }
  }

  public async createSelectableList(
    data: { name: string; description?: string; items?: string[] },
    multipleImport = false,
    clickCancel = false
  ) {
    await this.entitySelectCreateBtn().click();
    await this.page.waitForTimeout(250);
    await this.entitySelectCreateName().waitFor({ state: 'visible', timeout: 40000 });
    await this.entitySelectCreateName().fill(data.name);
    await this.page.waitForTimeout(250);
    if (data.description) {
      await this.entitySelectCreateDescription().fill(data.description);
      await this.page.waitForTimeout(250);
    }
    if (data.items != null) {
      if (multipleImport) {
        await this.entitySelectCreateImportListBtn().click();
        await this.entitySelectImportTextArea().waitFor({ state: 'visible', timeout: 40000 });
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          await this.entitySelectImportTextArea().pressSequentially(item);
          await this.page.waitForTimeout(250);
        }
        await this.entitySelectImportSaveBtn().click();
        await this.page.waitForTimeout(250);
      } else {
        for (let i = 0; i < data.items.length; i++) {
          await this.entitySelectCreateSingleItemBtn().click();
          await this.page.waitForTimeout(250);
          await (await this.getLastItemCreateObject()).edit(data.items[i]);
        }
      }
    }
    if (!clickCancel) {
      await this.entitySelectCreateSaveBtn().click();
      await this.page.waitForTimeout(250);
    } else {
      await this.entitySelectCreateCancelBtn().click();
      await this.page.waitForTimeout(250);
    }
    await this.entitySelectCreateBtn().waitFor({ state: 'visible' });
  }

  public async cleanupList() {
    for (let i = await this.selectableListCount(); i > 0; i--) {
      const obj = new SelectableListRowObject(this.page, this);
      const row = await obj.getRow(i);
      if (row.name !== 'Device users') {
        await row.delete();
      }
    }
  }
}

export class SelectableListRowObject {
  constructor(page: Page, selectableLists: SelectableListsPage) {
    this.page = page;
    this.selectableLists = selectableLists;
  }

  page: Page;
  selectableLists: SelectableListsPage;
  index: number;
  id: number;
  name: string;
  description: string;
  editBtn: Locator;
  deleteBtn: Locator;

  public async getRow(rowNum: number) {
    this.index = rowNum;
    rowNum = rowNum - 1;
    this.id = +(await this.page.locator('td.id').nth(rowNum).textContent() || '0');
    try {
      this.name = await this.page.locator('td.name').nth(rowNum).textContent() || '';
    } catch (e) {}
    try {
      this.description = await this.page.locator('td.description').nth(rowNum).textContent() || '';
    } catch (e) {}
    try {
      this.deleteBtn = this.page.locator('button.entitySelectDeleteBtn').nth(rowNum);
    } catch (e) {}
    try {
      this.editBtn = this.page.locator('button.entitySelectEditBtn').nth(rowNum);
    } catch (e) {}
    return this;
  }

  async delete(clickCancel = false) {
    const index = this.index - 1;
    await this.selectableLists.openRowMenu(index);
    const deleteBtn = this.page.locator(`#entitySelectDeleteBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();
    await this.page.waitForTimeout(250);

    if (!clickCancel) {
      await this.selectableLists.entitySelectDeleteDeleteBtn().click();
      await this.page.waitForTimeout(250);
    } else {
      await this.selectableLists.entitySelectDeleteCancelBtn().click();
      await this.page.waitForTimeout(250);
    }

    await this.selectableLists.entitySelectCreateBtn().waitFor({ state: 'visible' });
  }

  async openEdit() {
    const index = this.index - 1;

    await this.selectableLists.openRowMenu(index);
    const editBtn = this.page.locator(`#entitySelectEditBtn${index}`);

    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();

    await this.selectableLists.entitySelectEditCancelBtn().waitFor({ state: 'visible' });
  }

  async closeEdit(clickCancel = false) {
    if (!clickCancel) {
      await this.selectableLists.entitySelectEditSaveBtn().click();
      await this.page.waitForTimeout(250);
    } else {
      await this.selectableLists.entitySelectEditCancelBtn().click();
    }
    await this.selectableLists.entitySelectCreateBtn().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(250);
  }

  async edit(
    data: { name?: string; description?: string; items?: string[] },
    multipleImport = false,
    clearItems = false,
    clickCancel = false,
    editItems = false
  ) {
    await this.openEdit();
    if (data.name != null) {
      await this.selectableLists.entitySelectEditName().fill(data.name);
    }
    if (data.description != null) {
      await this.selectableLists.entitySelectEditDescription().fill(data.description);
    }
    if (clearItems && (await this.selectableLists.itemsEditPageCount()) > 0) {
      for (let i = (await this.selectableLists.itemsEditPageCount()); i > 0; i--) {
        await (await this.selectableLists.getFirstItemEditObject()).delete();
        await this.page.waitForTimeout(250);
      }
    }
    if (data.items != null) {
      if (multipleImport) {
        const button = this.selectableLists.entitySelectEditImportListBtn();
        await button.click();
        await this.selectableLists.entitySelectImportTextArea().waitFor({
          state: 'visible',
          timeout: 40000,
        });
        await this.page.waitForTimeout(250);
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          await this.selectableLists.entitySelectImportTextArea().pressSequentially(item);
        }
        await this.selectableLists.entitySelectImportSaveBtn().click();
        await this.page.waitForTimeout(250);
      } else {
        for (let i = 0; i < (data.items).length; i++) {
          if (editItems) {
            const itemObj = new EntitySelectItemEditRowObject(this.page, this.selectableLists);
            const item = await itemObj.getRow(i + 1);
            if (item) {
              await item.edit(data.items[i]);
            } else {
              await this.selectableLists.entitySelectEditSingleItemBtn().click();
              await this.page.waitForTimeout(250);
              await (await this.selectableLists.getLastItemEditObject()).edit(data.items[i]);
              await this.page.waitForTimeout(250);
            }
          }
        }
      }
    }
    await this.closeEdit(clickCancel);
  }
}

export class EntitySelectItemEditRowObject {
  constructor(page: Page, selectableLists: SelectableListsPage) {
    this.page = page;
    this.selectableLists = selectableLists;
  }

  page: Page;
  selectableLists: SelectableListsPage;
  name: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number): Promise<EntitySelectItemEditRowObject | null> {
    const row = this.page.locator('app-entity-list-elements .d-flex').nth(rowNum - 1);
    if ((await this.page.locator('app-entity-list-elements .d-flex').count()) >= rowNum) {
      try {
        this.name = await row.locator('.createEntityItemName').textContent() || '';
      } catch (e) {}
      try {
        this.editBtn = row.locator('.entityItemEditBtn');
      } catch (e) {}
      try {
        this.deleteBtn = row.locator('.entityItemDeleteBtn');
      } catch (e) {}
    } else {
      return null;
    }
    return this;
  }

  async edit(newName: string, clickCancel = false) {
    await this.editBtn.click();
    await this.page.waitForTimeout(250);
    await this.selectableLists.entitySelectEditItemNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    if (!clickCancel) {
      await this.selectableLists.entitySelectEditItemSaveBtn().click();
    } else {
      await this.selectableLists.entitySelectEditItemCancelBtn().click();
    }
    await this.page.waitForTimeout(250);
    await this.selectableLists.entitySelectEditCancelBtn().waitFor({ state: 'visible' });
  }

  async delete() {
    await this.deleteBtn.scrollIntoViewIfNeeded();
    await this.deleteBtn.click();
    await this.page.waitForTimeout(250);
  }
}

export class EntitySelectItemCreateRowObject {
  constructor(page: Page, selectableLists: SelectableListsPage) {
    this.page = page;
    this.selectableLists = selectableLists;
  }

  page: Page;
  selectableLists: SelectableListsPage;
  name: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number) {
    if ((await this.page.locator('.createEntityItemName').count()) >= rowNum) {
      try {
        this.name = await this.page.locator('.createEntityItemName').nth(rowNum - 1).textContent() || '';
      } catch (e) {}
      try {
        this.editBtn = this.page.locator('.entityItemEditBtn').nth(rowNum - 1);
      } catch (e) {}
      try {
        this.deleteBtn = this.page.locator('.entityItemDeleteBtn').nth(rowNum - 1);
      } catch (e) {}
    }
    return this;
  }

  async edit(newName: string, clickCancel = false) {
    await this.editBtn.scrollIntoViewIfNeeded();
    await this.editBtn.click();
    await this.page.waitForTimeout(250);
    await this.selectableLists.entitySelectEditItemNameBox().fill(newName);
    await this.page.waitForTimeout(250);
    if (!clickCancel) {
      await this.selectableLists.entitySelectEditItemSaveBtn().click();
    } else {
      await this.selectableLists.entitySelectEditItemCancelBtn().click();
    }
    await this.page.waitForTimeout(250);
    await this.selectableLists.entitySelectCreateCancelBtn().waitFor({ state: 'visible' });
  }

  async delete() {
    await this.deleteBtn.scrollIntoViewIfNeeded();
    await this.deleteBtn.click();
  }
}
