import { PageWithNavbarPage } from './PageWithNavbar.page';
import { generateRandmString } from '../Helpers/helper-functions';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async selectableListCount(): Promise<number> {
    return (await $$('#tableBodyEntitySelect > tr')).length;
  }

  public async itemsEditPageCount(): Promise<number> {
    let i = 0;
    while ((await $(`#entitySelectItemEditNameentityItemUId_${i}`)).isExisting()) {
      i++;
    }
    return i;
  }

  public async itemsCreatePageCount(): Promise<number> {
    return (await $$('#createEntityItemName')).length;
  }

  public async entitySelectCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateName(): Promise<WebdriverIO.Element> {
    const ele = await $('#createName');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateDescription(): Promise<WebdriverIO.Element> {
    const ele = await $('#createDescription');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateImportListBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#importEntitySelectBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateSingleItemBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#addSingleEntitySelectableItem');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createEntitySelectSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectCreateCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createEntitySelectCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditName(): Promise<WebdriverIO.Element> {
    const ele = await $('#editName');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditDescription(): Promise<WebdriverIO.Element> {
    const ele = await $('#editDescription');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditImportListBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editEntitySelectImportBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditSingleItemBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editEntitySelectCreateItem');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editEntitySelectSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editEntitySelectCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectImportTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $('#entityImportTextArea');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectImportSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#entityImportSaveBtn`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectImportCancelBtn(): Promise<WebdriverIO.Element> {
    return $('#entityImportCancelBtn');
  }

  public async entitySelectDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditItemNameBox(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectItemEditNameBox');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditItemSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectItemSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectEditItemCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#entitySelectItemCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async getFirstEntityItemOnEdit(): Promise<EntitySelectItemEditRowObject> {
    await browser.pause(500);
    const obj = new EntitySelectItemEditRowObject();
    return await obj.getRow(1);
  }

  public async idTableHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('#idTableHeader');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async nameTableHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('#nameTableHeader');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async descriptionTableHeader(): Promise<WebdriverIO.Element> {
    const ele = await $('#descriptionTableHeader');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async getEntitySelectItemEditRowObjectByIndex(
    index: number
  ): Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject();
    return await obj.getRow(index);
  }

  async getFirstSelectableListObject(): Promise<SelectableListRowObject> {
    const obj = new SelectableListRowObject();
    return await obj.getRow(1);
  }

  async getLastSelectableListObject(): Promise<SelectableListRowObject> {
    const obj = new SelectableListRowObject();
    return await obj.getRow(await this.selectableListCount());
  }

  async getFirstItemEditObject(): Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject();
    return await obj.getRow(1);
  }

  async getLastItemEditObject(): Promise<EntitySelectItemEditRowObject> {
    const obj = new EntitySelectItemEditRowObject();
    return await obj.getRow(await this.itemsEditPageCount());
  }

  async getLastItemCreateObject(): Promise<EntitySelectItemCreateRowObject> {
    const obj = new EntitySelectItemCreateRowObject();
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
    await (await this.entitySelectCreateBtn()).click();
    await (await this.entitySelectCreateName()).waitForDisplayed({ timeout: 40000 });
    await (await this.entitySelectCreateName()).setValue(data.name);
    if (data.description) {
      await (await this.entitySelectCreateDescription()).setValue(data.description);
    }
    if (data.items != null) {
      if (multipleImport) {
        await (await this.entitySelectCreateImportListBtn()).click();
        await (await this.entitySelectImportTextArea()).waitForDisplayed({ timeout: 40000 });
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          await (await this.entitySelectImportTextArea()).addValue(item);
        }
        await (await this.entitySelectImportSaveBtn()).click();
      } else {
        for (let i = 0; i < data.items.length; i++) {
          await (await this.entitySelectCreateSingleItemBtn()).click();
          await (await this.getLastItemCreateObject()).edit(data.items[i]);
        }
      }
    }
    if (!clickCancel) {
      await (await this.entitySelectCreateSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await this.entitySelectCreateCancelBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    await (await this.entitySelectCreateBtn()).waitForDisplayed();
  }

  public async cleanupList() {
    for (let i = await this.selectableListCount(); i > 0; i--) {
      await (await this.getFirstSelectableListObject()).delete();
    }
  }
}

const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor() {}

  element: WebdriverIO.Element;
  id: number;
  name: string;
  description: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  async getRow(rowNum: number) {
    this.element = (await $$('#tableBodyEntitySelect > tr'))[rowNum - 1];
    if (this.element) {
      this.id = +await (await (await this.element).$('#entitySelectMicrotingUUID')).getText();
      try {
        this.name = await (await (await this.element).$('#entitySelectName')).getText();
      } catch (e) {}
      try {
        this.description = await (await (await this.element).$('#entitySelectDescription')).getText();
      } catch (e) {}
      try {
        this.deleteBtn = await (await this.element).$('#entitySelectDeleteBtn');
      } catch (e) {}
      try {
        this.editBtn = await (await this.element).$('#entitySelectEditBtn');
      } catch (e) {}
    }
    return this;
  }

  async delete(clickCancel = false) {
    await this.deleteBtn.click();
    if (!clickCancel) {
      await (await selectableLists.entitySelectDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await selectableLists.entitySelectDeleteCancelBtn()).click();
    }
    await (await selectableLists.entitySelectCreateBtn()).waitForDisplayed();
  }

  async openEdit() {
    await this.editBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await (await selectableLists.entitySelectEditCancelBtn()).waitForDisplayed();
  }

  async closeEdit(clickCancel = false) {
    if (!clickCancel) {
      await (await selectableLists.entitySelectEditSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      await (await selectableLists.entitySelectEditCancelBtn()).click();
    }
    await (await selectableLists.entitySelectCreateBtn()).waitForDisplayed();
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
      await (await selectableLists.entitySelectEditName()).setValue(data.name);
    }
    if (data.description != null) {
      await (await selectableLists.entitySelectEditDescription()).setValue(data.description);
    }
    if (clearItems && (await selectableLists.itemsEditPageCount()) > 0) {
      for (let i = (await selectableLists.itemsEditPageCount()); i > 0; i--) {
        await (await selectableLists.getFirstItemEditObject()).delete();
      }
    }
    if (data.items != null) {
      if (multipleImport) {
        await (await selectableLists.entitySelectEditImportListBtn()).click();
        await (await selectableLists.entitySelectImportTextArea()).waitForDisplayed({
          timeout: 40000,
        });
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          await (await selectableLists.entitySelectImportTextArea()).addValue(item);
        }
        await (await selectableLists.entitySelectImportSaveBtn()).click();
      } else {
        for (let i = 0; i < (await data.items).length; i++) {
          if (editItems) {
            const itemObj = new EntitySelectItemEditRowObject();
            const item = await itemObj.getRow(i);
            if (item) {
              await item.edit(data.items[i]);
            } else {
              await (await selectableLists.entitySelectEditSingleItemBtn()).click();
              await (await selectableLists.getLastItemEditObject()).edit(data.items[i]);
            }
          }
          await (await selectableLists.entitySelectEditSingleItemBtn()).click();
          await (await selectableLists.getLastItemEditObject()).edit(data.items[i]);
        }
      }
    }
    await this.closeEdit(clickCancel);
  }
}

export class EntitySelectItemEditRowObject {
  constructor() {
  }

  name;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number): Promise<EntitySelectItemEditRowObject> {
    const name = await $('#entitySelectItemEditNameentityItemUId_' + (rowNum - 1));
    if (name) {
      try {
        this.name = name.getText();
      } catch (e) {}
      try {
        this.editBtn = await $('#entitySelectEditItemEditBtn_' + (rowNum - 1));
      } catch (e) {}
      try {
        this.deleteBtn = await $('#entitySelectEditItemDeleteBtn_' + (rowNum - 1));
      } catch (e) {}
    } else {
      return null;
    }
    return this;
  }

  async edit(newName: string, clickCancel = false) {
    await this.editBtn.scrollIntoView();
    await this.editBtn.click();
    await (await selectableLists.entitySelectEditItemNameBox()).setValue(newName);
    if (!clickCancel) {
      await (await selectableLists.entitySelectEditItemSaveBtn()).click();
    } else {
      await (await selectableLists.entitySelectEditItemCancelBtn()).click();
    }
    await (await selectableLists.entitySelectEditCancelBtn()).waitForDisplayed();
  }

  delete() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
  }
}

export class EntitySelectItemCreateRowObject {
  constructor() {}

  name;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number) {
    if ((await $$('#createEntityItemName'))[rowNum - 1]) {
      try {
        this.name = await (await (await $$('#createEntityItemName'))[rowNum - 1]).getText();
      } catch (e) {}
      try {
        this.editBtn = (await $$('#entitySelectCreateSingleItemEdit'))[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = (await $$('#entitySelectCreateSingleItemDelete'))[
        rowNum - 1
          ];
      } catch (e) {}
    }
    return this;
  }

  async edit(newName: string, clickCancel = false) {
    await this.editBtn.scrollIntoView();
    await this.editBtn.click();
    await (await selectableLists.entitySelectEditItemNameBox()).setValue(newName);
    if (!clickCancel) {
      await (await selectableLists.entitySelectEditItemSaveBtn()).click();
    } else {
      await (await selectableLists.entitySelectEditItemCancelBtn()).click();
    }
    await (await selectableLists.entitySelectCreateCancelBtn()).waitForDisplayed();
  }

  async delete() {
    await this.deleteBtn.scrollIntoView();
    await this.deleteBtn.click();
  }
}
