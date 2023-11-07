import Page from '../Page';
import * as R from 'ramda';

export class BackendConfigurationPropertiesPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  public async backendConfigurationPnButton() {
    const ele = await $('#backend-configuration-pn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async backendConfigurationPnPropertiesButton() {
    const ele = await $('#backend-configuration-pn-properties');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyCreateBtn() {
    const ele = await $('#propertyCreateBtn');
    await ele.waitForDisplayed({ timeout: 200000 });
    await ele.waitForClickable({ timeout: 200000 });
    return ele;
  }

  public async createPropertyName() {
    const ele = await $('#createPropertyName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createCHRNumber() {
    const ele = await $('#createCHRNumber');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createCVRNumber() {
    const ele = await $('#createCVRNumber');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createPropertyAddress() {
    const ele = await $('#createPropertyAddress');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async checkboxCreatePropertySelectLanguage(languageId: number) {
    const ele = await $(`#checkboxCreatePropertySelectLanguage${languageId}`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyCreateSaveBtn() {
    const ele = await $('#propertyCreateSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyCreateSaveCancelBtn() {
    const ele = await $('#propertyCreateSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyDeleteDeleteBtn() {
    const ele = await $('#propertyDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyDeleteCancelBtn() {
    const ele = await $('#propertyDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editPropertyName() {
    const ele = await $('#editPropertyName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editCHRNumber() {
    const ele = await $('#editCHRNumber');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editCVRNumber() {
    const ele = await $('#editCVRNumber');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editPropertyAddress() {
    const ele = await $('#editPropertyAddress');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async checkboxEditPropertySelectLanguage(languageId: number) {
    const ele = await $(`#checkboxEditPropertySelectLanguage${languageId}`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyEditSaveBtn() {
    const ele = await $('#propertyEditSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyEditSaveCancelBtn() {
    const ele = await $('#propertyEditSaveCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editPropertyAreasViewSaveBtn() {
    const ele = await $('#editPropertyAreasViewSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editPropertyAreasViewCloseBtn() {
    const ele = await $('#editPropertyAreasViewCloseBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyAreasViewCloseBtn() {
    const ele = await $('#propertyAreasViewCloseBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyCreateWorkorderFlowEnableToggle() {
    const ele = await $(`[for='propertyCreateWorkorderFlowEnableToggle-input']`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyEditWorkorderFlowEnableToggleInput() {
    const ele = await $('#propertyEditWorkorderFlowEnableToggle');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async propertyEditWorkorderFlowEnableToggle() {
    const ele = await $(`[for='propertyEditWorkorderFlowEnableToggle']`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async configurePropertyAreasBtn() {
    const ele = await $('#configurePropertyAreasBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async navigateToPropertyArea(i: number) {
    const ele = await $$(`#navigateToPropertyArea`)[i];
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async goToProperties() {
    const ele = await $('#backend-configuration-pn-properties');
    if (!await ele.isDisplayed()) {
      await (await this.backendConfigurationPnButton()).click();
    }
    await (await this.backendConfigurationPnPropertiesButton()).click();
    await (await this.propertyCreateBtn()).waitForClickable({ timeout: 90000 });
  }

  public async createProperty(
    property: PropertyCreateUpdate,
    clickCancel = false
  ) {
    await this.openCreatePropertyModal(property);
    await this.closeCreatePropertyModal(clickCancel);
  }

  public async openCreatePropertyModal(property: PropertyCreateUpdate) {
    await (await this.propertyCreateBtn()).click();
    await browser.pause(500);
    await (await this.propertyCreateSaveCancelBtn()).waitForClickable({
      timeout: 40000,
    });
    if (property) {
      if (property.cvrNumber) {
        await (await this.createCVRNumber()).setValue(property.cvrNumber);
      }
      if (property.name) {
        await (await this.createPropertyName()).setValue(property.name);
      }
      if (property.chrNumber) {
        await (await this.createCHRNumber()).setValue(property.chrNumber);
      }
      if (property.address) {
        await (await this.createPropertyAddress()).setValue(property.address);
      }
      /*if (property.selectedLanguages) {
        for (let i = 0; i < property.selectedLanguages.length; i++) {
          let languageId = 0;
          if (property.selectedLanguages[i].languageId) {
            languageId = property.selectedLanguages[i].languageId;
          } else {
            languageId = applicationLanguages.find(
              (x) => x.text === property.selectedLanguages[i].languageName
            ).id;
          }
          const checkboxForClick = await (
            await this.checkboxCreatePropertySelectLanguage(languageId)
          ).$('..');
          await checkboxForClick.click();
        }
      }*/
      if(property.workOrderFlow === true){
        await (await this.propertyCreateWorkorderFlowEnableToggle()).click();
        await browser.pause(500);
      }
    }
  }

  public async closeCreatePropertyModal(clickCancel = false) {
    if (clickCancel) {
      await (await this.propertyCreateSaveCancelBtn()).click();
    } else {
      await (await this.propertyCreateSaveBtn()).click();
    }
    await browser.pause(500);
    await (await this.propertyCreateBtn()).waitForClickable({ timeout: 90000 });
  }

  public async getFirstPropertyRowObject(): Promise<PropertyRowObject> {
    return await new PropertyRowObject().getRow(1);
  }

  public async getLastPropertyRowObject(): Promise<PropertyRowObject> {
    return await new PropertyRowObject().getRow(await this.rowNum());
  }

  public async getPropertyRowObjectByIndex(
    index: number
  ): Promise<PropertyRowObject> {
    return await new PropertyRowObject().getRow(index);
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      await (await new PropertyRowObject().getRow(1)).delete();
    }
  }
}

const backendConfigurationPropertiesPage = new BackendConfigurationPropertiesPage();
export default backendConfigurationPropertiesPage;

export class PropertyRowObject {
  constructor() {}

  public row: WebdriverIO.Element;
  public id: number;
  public name: string;
  public chrNumber: string;
  public cvrNumber: string;
  public address: string;
  // public languages: { languageId: number; languageName: string }[];
  public editPropertyAreasBtn: WebdriverIO.Element;
  public editPropertyBtn: WebdriverIO.Element;
  public deletePropertyBtn: WebdriverIO.Element;
  public propertyTaskAreasBtn: WebdriverIO.Element;

  public async getRow(rowNum: number): Promise<PropertyRowObject> {
    rowNum = rowNum - 1;
    this.id = +await (await $('#propertyId-'+rowNum)).getText();
    this.name = await (await $('#propertyName-'+rowNum)).getText();
    this.chrNumber = await (await $('#propertyCHR-'+rowNum)).getText();
    this.cvrNumber = await (await $('#propertyCVR-'+rowNum)).getText();
    this.address = await (await $('#propertyAddress-'+rowNum)).getText();
    this.editPropertyAreasBtn = await $('#showPropertyAreasBtn-'+rowNum);
    this.editPropertyBtn = await $('#editPropertyBtn-'+rowNum);
    this.deletePropertyBtn = await $('#deletePropertyBtn-'+rowNum);
    this.propertyTaskAreasBtn = await $('#updateEntityList-'+rowNum);
    return this;
  }

  public async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  public async openDeleteModal() {
    await this.deletePropertyBtn.click();
    await (
      await backendConfigurationPropertiesPage.propertyDeleteCancelBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationPropertiesPage.propertyDeleteCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationPropertiesPage.propertyDeleteDeleteBtn()
      ).click();
    }
    await (
      await backendConfigurationPropertiesPage.propertyCreateBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async edit(property: PropertyCreateUpdate, clickCancel = false) {
    await this.openEditModal(property);
    await this.closeEditModal(clickCancel);
  }

  public async openEditModal(property: PropertyCreateUpdate) {
    await this.editPropertyBtn.click();
    await (
      await backendConfigurationPropertiesPage.propertyEditSaveCancelBtn()
    ).waitForClickable({ timeout: 40000 });
    if (property) {
      if (property.name) {
        await (
          await backendConfigurationPropertiesPage.editPropertyName()
        ).setValue(property.name);
      }
      if (property.chrNumber) {
        await (
          await backendConfigurationPropertiesPage.editCHRNumber()
        ).setValue(property.chrNumber);
      }
      if (property.cvrNumber) {
        await (
          await backendConfigurationPropertiesPage.editCVRNumber()
        ).setValue(property.cvrNumber);
      }
      if (property.address) {
        await (
          await backendConfigurationPropertiesPage.editPropertyAddress()
        ).setValue(property.address);
      }
      /*if (property.selectedLanguages) {
        for (let i = 0; i < property.selectedLanguages.length; i++) {
          let languageId = 0;
          if (property.selectedLanguages[i].languageId) {
            languageId = property.selectedLanguages[i].languageId;
          } else {
            languageId = applicationLanguages.find(
              (x) => x.text === property.selectedLanguages[i].languageName
            ).id;
          }
          const checkboxForClick = await (
            await backendConfigurationPropertiesPage.checkboxEditPropertySelectLanguage(
              languageId
            )
          ).$('..');
          await checkboxForClick.click();
        }
      }*/
      if(property.workOrderFlow === true || property.workOrderFlow === false) {
        const workOrderFlow = (await (await backendConfigurationPropertiesPage.propertyEditWorkorderFlowEnableToggleInput()
        ).getValue()) === 'true'
        if(property.workOrderFlow === true && workOrderFlow !== true || property.workOrderFlow === false && workOrderFlow !== false){
          await (await backendConfigurationPropertiesPage.propertyEditWorkorderFlowEnableToggle()).click();
        }
      }
    }
  }

  public async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationPropertiesPage.propertyEditSaveCancelBtn()
      ).click();
    } else {
      await (
        await backendConfigurationPropertiesPage.propertyEditSaveBtn()
      ).click();
    }
    await (
      await backendConfigurationPropertiesPage.propertyCreateBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async bindOrUnbindWithAllAreas(clickCancel = false) {
    await this.editBindWithAreas(R.times(R.identity, 2), clickCancel);
  }

  public async editBindWithAreas(bindAreas?: number[], clickCancel = false) {
    await this.openBindPropertyWithAreasModal(bindAreas);
    await this.closeBindPropertyWithAreasModal(clickCancel);
  }

  public async openBindPropertyWithAreasModal(bindAreas?: number[]) {
    await this.editPropertyAreasBtn.click();
    await browser.pause(500);
    await (await backendConfigurationPropertiesPage.configurePropertyAreasBtn()).click();
    await (
      await backendConfigurationPropertiesPage.editPropertyAreasViewCloseBtn()
    ).waitForClickable({ timeout: 40000 });
    if (bindAreas) {
      for (let i = 0; i < bindAreas.length; i++) {
        await (await $(`#checkboxAssignmentEdit${bindAreas[i]}`).scrollIntoView());
        await (
          await $(`#checkboxAssignmentEdit${bindAreas[i]}`).$('..')
        ).click();
        await browser.pause(100);
      }
    }
  }

  public async closeBindPropertyWithAreasModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationPropertiesPage.editPropertyAreasViewCloseBtn()
      ).click();
    } else {
      await (
        await backendConfigurationPropertiesPage.editPropertyAreasViewSaveBtn()
      ).click();
    }
    await backendConfigurationPropertiesPage.goToProperties();
    await (
      await backendConfigurationPropertiesPage.propertyCreateBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async getBindAreas() {
    await this.openBindPropertyWithAreasModal();
    await browser.pause(500);
    const checkboxes = await $$(`mat-checkbox-input`);
    let mas = [];
    for (let i = 0; i < checkboxes.length; i++) {
      mas = [...mas, !!(await (await checkboxes[i]).getAttribute('aria-checked'))];
    }
    return mas;
  }

  public async openAreasViewModal(indexAreaForClick: number) {
    await this.editPropertyAreasBtn.waitForClickable({ timeout: 40000 });
    await this.editPropertyAreasBtn.click();
    await (
      await backendConfigurationPropertiesPage.configurePropertyAreasBtn()
    );
    await browser.pause(500);
    await (
      await backendConfigurationPropertiesPage.navigateToPropertyArea(
        indexAreaForClick
      )
    ).click();

    await browser.pause(500);
  }

  public async closeAreasViewModal() {
    await (
      await backendConfigurationPropertiesPage.propertyAreasViewCloseBtn()
    ).waitForClickable({ timeout: 40000 });
    await (
      await backendConfigurationPropertiesPage.propertyAreasViewCloseBtn()
    ).click();
    await (
      await backendConfigurationPropertiesPage.propertyCreateBtn()
    ).waitForClickable({ timeout: 40000 });
  }
}

export class PropertyCreateUpdate {
  name?: string;
  chrNumber?: string;
  cvrNumber?: string;
  address?: string;
  // selectedLanguages?: { languageId?: number; languageName?: string }[];
  workOrderFlow?: boolean
}
