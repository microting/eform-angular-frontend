import { PageWithNavbarPage } from './PageWithNavbar.page';
import { generateRandmString } from '../Helpers/helper-functions';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get selectableListCount(): number {
    return $$('#tableBodyEntitySelect > tr').length;
  }

  public get itemsEditPageCount(): number {
    let i = 0;
    while ($(`#entitySelectItemEditNameentityItemUId_${i}`).isExisting()) {
      i++;
    }
    return i;
  }

  public get itemsCreatePageCount(): number {
    return $$('#createEntityItemName').length;
  }

  public get entitySelectCreateBtn() {
    const ele = $('#entitySelectCreateBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateName() {
    const ele = $('#createName');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateDescription() {
    const ele = $('#createDescription');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateImportListBtn() {
    const ele = $('#importEntitySelectBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateSingleItemBtn() {
    const ele = $('#addSingleEntitySelectableItem');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateSaveBtn() {
    const ele = $('#createEntitySelectSaveBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectCreateCancelBtn() {
    const ele = $('#createEntitySelectCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditName() {
    const ele = $('#editName');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditDescription() {
    const ele = $('#editDescription');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditImportListBtn() {
    const ele = $('#editEntitySelectImportBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditSingleItemBtn() {
    const ele = $('#editEntitySelectCreateItem');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditSaveBtn() {
    const ele = $('#editEntitySelectSaveBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditCancelBtn() {
    const ele = $('#editEntitySelectCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectImportTextArea() {
    const ele = $('#entityImportTextArea');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectImportSaveBtn() {
    const ele = $(`#entityImportSaveBtn`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectImportCancelBtn() {
    return $('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    const ele = $('#entitySelectDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectDeleteCancelBtn() {
    const ele = $('#entitySelectDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditItemNameBox() {
    const ele = $('#entitySelectItemEditNameBox');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditItemSaveBtn() {
    const ele = $('#entitySelectItemSaveBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectEditItemCancelBtn() {
    const ele = $('#entitySelectItemCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get getFirstEntityItemOnEdit(): EntitySelectItemEditRowObject {
    browser.pause(500);
    return new EntitySelectItemEditRowObject(1);
  }

  public get idTableHeader() {
    const ele = $('#idTableHeader');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get nameTableHeader() {
    const ele = $('#nameTableHeader');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get descriptionTableHeader() {
    const ele = $('#descriptionTableHeader');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public getEntitySelectItemEditRowObjectByIndex(
    index: number
  ): EntitySelectItemEditRowObject {
    return new EntitySelectItemEditRowObject(index);
  }

  getFirstSelectableListObject(): SelectableListRowObject {
    return new SelectableListRowObject(1);
  }

  getLastSelectableListObject(): SelectableListRowObject {
    return new SelectableListRowObject(this.selectableListCount);
  }

  getFirstItemEditObject(): EntitySelectItemEditRowObject {
    return new EntitySelectItemEditRowObject(1);
  }

  getLastItemEditObject(): EntitySelectItemEditRowObject {
    return new EntitySelectItemEditRowObject(this.itemsEditPageCount);
  }

  getLastItemCreateObject(): EntitySelectItemCreateRowObject {
    return new EntitySelectItemCreateRowObject(this.itemsCreatePageCount);
  }

  public createDummySelectableLists(count = 3) {
    for (let i = 0; i < count; i++) {
      this.createSelectableList({
        name: generateRandmString(),
        description: generateRandmString(),
      });
    }
  }

  public createSelectableList(
    data: { name: string; description?: string; items?: string[] },
    multipleImport = false,
    clickCancel = false
  ) {
    this.entitySelectCreateBtn.click();
    this.entitySelectCreateName.waitForDisplayed({ timeout: 40000 });
    this.entitySelectCreateName.setValue(data.name);
    if (data.description) {
      this.entitySelectCreateDescription.setValue(data.description);
    }
    if (data.items != null) {
      if (multipleImport) {
        this.entitySelectCreateImportListBtn.click();
        this.entitySelectImportTextArea.waitForDisplayed({ timeout: 40000 });
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          this.entitySelectImportTextArea.addValue(item);
        }
        this.entitySelectImportSaveBtn.click();
      } else {
        for (let i = 0; i < data.items.length; i++) {
          this.entitySelectCreateSingleItemBtn.click();
          this.getLastItemCreateObject().edit(data.items[i]);
        }
      }
    }
    if (!clickCancel) {
      this.entitySelectCreateSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      this.entitySelectCreateCancelBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    this.entitySelectCreateBtn.waitForDisplayed();
  }

  public cleanupList() {
    for (let i = this.selectableListCount; i > 0; i--) {
      this.getFirstSelectableListObject().delete();
    }
  }
}

const selectableLists = new SelectableListsPage();
export default selectableLists;

export class SelectableListRowObject {
  constructor(rowNumber) {
    this.element = $$('#tableBodyEntitySelect > tr')[rowNumber - 1];
    if (this.element) {
      this.id = +this.element.$('#entitySelectMicrotingUUID').getText();
      try {
        this.name = this.element.$('#entitySelectName').getText();
      } catch (e) {}
      try {
        this.description = this.element.$('#entitySelectDescription').getText();
      } catch (e) {}
      try {
        this.deleteBtn = this.element.$('#entitySelectDeleteBtn');
      } catch (e) {}
      try {
        this.editBtn = this.element.$('#entitySelectEditBtn');
      } catch (e) {}
    }
  }

  element: WebdriverIO.Element;
  id: number;
  name: string;
  description: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  delete(clickCancel = false) {
    this.deleteBtn.click();
    if (!clickCancel) {
      selectableLists.entitySelectDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      selectableLists.entitySelectDeleteCancelBtn.click();
    }
    selectableLists.entitySelectCreateBtn.waitForDisplayed();
  }

  openEdit() {
    this.editBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    selectableLists.entitySelectEditCancelBtn.waitForDisplayed();
  }

  closeEdit(clickCancel = false) {
    if (!clickCancel) {
      selectableLists.entitySelectEditSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    } else {
      selectableLists.entitySelectEditCancelBtn.click();
    }
    selectableLists.entitySelectCreateBtn.waitForDisplayed();
  }

  edit(
    data: { name?: string; description?: string; items?: string[] },
    multipleImport = false,
    clearItems = false,
    clickCancel = false,
    editItems = false
  ) {
    this.openEdit();
    if (data.name != null) {
      selectableLists.entitySelectEditName.setValue(data.name);
    }
    if (data.description != null) {
      selectableLists.entitySelectEditDescription.setValue(data.description);
    }
    if (clearItems && selectableLists.itemsEditPageCount > 0) {
      for (let i = selectableLists.itemsEditPageCount; i > 0; i--) {
        selectableLists.getFirstItemEditObject().delete();
      }
    }
    if (data.items != null) {
      if (multipleImport) {
        selectableLists.entitySelectEditImportListBtn.click();
        selectableLists.entitySelectImportTextArea.waitForDisplayed({
          timeout: 40000,
        });
        for (let i = 0; i < data.items.length; i++) {
          let item = data.items[i];
          if (!item.includes('\n') && i !== data.items.length - 1) {
            item = item + '\n';
          }
          selectableLists.entitySelectImportTextArea.addValue(item);
        }
        selectableLists.entitySelectImportSaveBtn.click();
      } else {
        for (let i = 0; i < data.items.length; i++) {
          if (editItems) {
            const item = new EntitySelectItemEditRowObject(i + 1);
            if (item) {
              item.edit(data.items[i]);
            } else {
              selectableLists.entitySelectEditSingleItemBtn.click();
              selectableLists.getLastItemEditObject().edit(data.items[i]);
            }
          }
          selectableLists.entitySelectEditSingleItemBtn.click();
          selectableLists.getLastItemEditObject().edit(data.items[i]);
        }
      }
    }
    this.closeEdit(clickCancel);
  }
}

export class EntitySelectItemEditRowObject {
  constructor(rowNumber) {
    const name = $('#entitySelectItemEditNameentityItemUId_' + (rowNumber - 1));
    if (name) {
      try {
        this.name = name.getText();
      } catch (e) {}
      try {
        this.editBtn = $('#entitySelectEditItemEditBtn_' + (rowNumber - 1));
      } catch (e) {}
      try {
        this.deleteBtn = $('#entitySelectEditItemDeleteBtn_' + (rowNumber - 1));
      } catch (e) {}
    } else {
      return null;
    }
  }

  name;
  editBtn;
  deleteBtn;

  edit(newName: string, clickCancel = false) {
    this.editBtn.scrollIntoView();
    this.editBtn.click();
    selectableLists.entitySelectEditItemNameBox.setValue(newName);
    if (!clickCancel) {
      selectableLists.entitySelectEditItemSaveBtn.click();
    } else {
      selectableLists.entitySelectEditItemCancelBtn.click();
    }
    selectableLists.entitySelectEditCancelBtn.waitForDisplayed();
  }

  delete() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
  }
}

export class EntitySelectItemCreateRowObject {
  constructor(rowNumber) {
    if ($$('#createEntityItemName')[rowNumber - 1]) {
      try {
        this.name = $$('#createEntityItemName')[rowNumber - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = $$('#entitySelectCreateSingleItemEdit')[rowNumber - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#entitySelectCreateSingleItemDelete')[
          rowNumber - 1
        ];
      } catch (e) {}
    }
  }

  name;
  editBtn;
  deleteBtn;

  edit(newName: string, clickCancel = false) {
    this.editBtn.scrollIntoView();
    this.editBtn.click();
    selectableLists.entitySelectEditItemNameBox.setValue(newName);
    if (!clickCancel) {
      selectableLists.entitySelectEditItemSaveBtn.click();
    } else {
      selectableLists.entitySelectEditItemCancelBtn.click();
    }
    selectableLists.entitySelectCreateCancelBtn.waitForDisplayed();
  }

  delete() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
  }
}
