import { PageWithNavbarPage } from '../PageWithNavbar.page';
import outerInnerResourceModalPage from './OuterInnerResourceModal.page';

export class OuterInnerResourceInnerResourcePage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBodyInnerResources > tr')).length;
  }

  public async outerInnerResourceDropdownMenu() {
    const ele = await $('#outer-inner-resource-pn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async innerResourceMenuPoint() {
    const ele = await $('#outer-inner-resource-pn-inner-resources');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async newInnerResourceBtn() {
    const ele = await $('#newInnerResource');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  async goToInnerResource() {
    await (await this.outerInnerResourceDropdownMenu()).click();
    await (await this.innerResourceMenuPoint()).click();
    await (await this.newInnerResourceBtn()).waitForDisplayed({ timeout: 20000 });
  }

  async getInnerObjectByName(name: string) {
    await browser.pause(500);
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const listRowObject = await this.getEformRowObj(i);
      if (listRowObject.name === name) {
        return listRowObject;
      }
    }
    return null;
  }

  public async getEformRowObj(i: number): Promise<ListRowObject> {
    const obj = new ListRowObject();
    return await obj.getRow(i);
  }

  async openCreateModal(name?: string, externalId?: number | string) {
    await (await this.newInnerResourceBtn()).click();
    if (name) {
      await (await outerInnerResourceModalPage.innerResourceCreateNameInput()).setValue(name);
    }
    if (externalId) {
      await (await outerInnerResourceModalPage.createInnerResourceId()).setValue(
        externalId.toString()
      );
    }
  }

  async closeCreateModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.innerResourceCreateSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.innerResourceCreateCancelBtn()).click();
      await (await this.newInnerResourceBtn()).waitForDisplayed({ timeout: 20000 });
    }
  }

  async createNewInnerResource(
    name?: string,
    externalId?: number | string,
    clickCancel = false
  ) {
    await this.openCreateModal(name, externalId);
    await this.closeCreateModal(clickCancel);
  }
}

const outerInnerResourceInnerResourcePage = new OuterInnerResourceInnerResourcePage();
export default outerInnerResourceInnerResourcePage;

export class ListRowObject {
  constructor() {
  }

  public id: number;
  public name: string;
  public externalId: number;
  public element;
  public updateBtn;
  public deleteBtn;

  async getRow(rowNum: number): Promise<ListRowObject> {
    this.element = (await $$('#tableBodyInnerResources > tr'))[rowNum - 1];
    if (this.element) {
      try {
        this.id = +await (await this.element.$('#innerResourceId')).getText();
      } catch (e) {}
      try {
        this.name = await (await this.element.$('#innerResourceName')).getText();
      } catch (e) {}
      try {
        this.externalId = +await (await this.element.$('#innerResourceExternalId')).getText();
      } catch (e) {}
      try {
        this.updateBtn = await this.element.$('#innerResourceEditBtn');
      } catch (e) {}
      try {
        this.deleteBtn = await this.element.$('#innerResourceDeleteBtn');
      } catch (e) {}
    }
    return this;
  }

  async openDeleteModal() {
    await this.deleteBtn.click();
    await (await outerInnerResourceModalPage.innerResourceDeleteDeleteBtn()).waitForDisplayed({
      timeout: 20000,
    });
  }

  async closeDeleteModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.innerResourceDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.innerResourceDeleteCancelBtn()).click();
      await (await outerInnerResourceInnerResourcePage.newInnerResourceBtn()).waitForDisplayed({
        timeout: 20000,
      });
    }
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openEditModal(newName?: string, newExternalId?: number | string) {
    await this.updateBtn.click();
    if (newName) {
      await (await outerInnerResourceModalPage.innerResourceEditName()).setValue(newName);
    }
    if (newExternalId) {
      await (await outerInnerResourceModalPage.innerResourceEditExternalIdInput()).setValue(
        newExternalId.toString()
      );
    }
  }

  async closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.innerResourceEditSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.innerResourceEditCancelBtn()).click();
      await (await outerInnerResourceInnerResourcePage.newInnerResourceBtn()).waitForDisplayed({
        timeout: 20000,
      });
    }
  }

  async edit(newName?: string, newExternalId?: number | string, clickCancel = false) {
    await this.openEditModal(newName, newExternalId);
    await this.closeEditModal(clickCancel);
  }
}
