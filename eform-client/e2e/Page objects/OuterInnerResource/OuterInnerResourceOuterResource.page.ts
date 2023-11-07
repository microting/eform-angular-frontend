import { PageWithNavbarPage } from '../PageWithNavbar.page';
import outerInnerResourceInnerResourcePage from './OuterInnerResourceInnerResource.page';
import outerInnerResourceModalPage from './OuterInnerResourceModal.page';

export class OuterInnerResourceOuterResourcePage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBodyOuterResources > tr')).length;
  }

  public async outerResourceMenuPoint() {
    const ele = await $('#outer-inner-resource-pn-outer-resources');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public async newOuterResourceBtn() {
    const ele = await $('#newOuterResourceBtn');
    await ele.waitForDisplayed({ timeout: 20000 });
    await ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  async goToOuterResource() {
    await (await outerInnerResourceInnerResourcePage.outerInnerResourceDropdownMenu()).click();
    await (await this.outerResourceMenuPoint()).click();
    await (await this.newOuterResourceBtn()).waitForDisplayed({ timeout: 20000 });
  }

  async getOuterObjectByName(name: string): Promise<ListRowObject> {
    browser.pause(500);
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
    await (await this.newOuterResourceBtn()).click();
    if (name) {
      await (await outerInnerResourceModalPage.outerResourceCreateNameInput()).setValue(name);
    }
    if (externalId) {
      await (await outerInnerResourceModalPage.createOuterResourceExternalId()).setValue(
        externalId.toString()
      );
    }
  }

  async closeCreateModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.outerResourceCreateSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.outerResourceCreateCancelBtn()).click();
      await (await this.newOuterResourceBtn()).waitForDisplayed({ timeout: 20000 });
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

const outerInnerResourceOuterResourcePage = new OuterInnerResourceOuterResourcePage();
export default outerInnerResourceOuterResourcePage;

export class ListRowObject {
  constructor() {  }

  public element;
  public id: number;
  public name: string;
  public externalId: number;
  public updateBtn;
  public deleteBtn;

  async getRow(rowNum: number): Promise<ListRowObject> {
    this.element = (await $$('#tableBodyOuterResources > tr'))[rowNum - 1];
    if (this.element) {
      try {
        this.name = await (await this.element.$('#outerResourceName')).getText();
      } catch (e) {}
      try {
        this.id = +await (await this.element.$('#outerResourceId')).getText();
      } catch (e) {}
      try {
        this.externalId = +await (await this.element.$('#outerResourceExternalId')).getText();
      } catch (e) {}
      try {
        this.updateBtn = await this.element.$('#outerResourceEditBtn');
      } catch (e) {}
      try {
        this.deleteBtn = await this.element.$('#outerResourceDeleteBtn');
      } catch (e) {}
    }
    return this;
  }

  async openDeleteModal() {
    await this.deleteBtn.click();
    await (await outerInnerResourceModalPage.outerResourceDeleteDeleteBtn()).waitForDisplayed({
      timeout: 20000,
    });
  }

  async closeDeleteModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.outerResourceDeleteDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.outerResourceDeleteCancelBtn()).click();
      await (await outerInnerResourceOuterResourcePage.newOuterResourceBtn()).waitForDisplayed({
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
      await (await outerInnerResourceModalPage.outerResourceEditNameInput()).setValue(newName);
    }
    if (newExternalId) {
      await (await outerInnerResourceModalPage.outerResourceEditExternalIdInput()).setValue(
        newExternalId.toString()
      );
    }
  }

  async closeEditModal(clickCancel = false) {
    if (!clickCancel) {
      await (await outerInnerResourceModalPage.outerResourceEditSaveBtn()).click();
      (await $('#spinner-animation')).waitForDisplayed({
        timeout: 20000,
        reverse: true,
      });
    } else {
      await (await outerInnerResourceModalPage.outerResourceEditCancelBtn()).click();
      await (await outerInnerResourceOuterResourcePage.newOuterResourceBtn()).waitForDisplayed({
        timeout: 20000,
      });
    }
  }

  async edit(newName?: string, newExternalId?: number | string, clickCancel = false) {
    await this.openEditModal(newName, newExternalId);
    await this.closeEditModal(clickCancel);
  }
}
