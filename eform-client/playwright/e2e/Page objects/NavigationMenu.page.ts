import { Page, Locator } from '@playwright/test';
import BasePage from './Page';

export class NavigationMenuPage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public menuItemsChilds(): Locator {
    return this.page.locator('#menuItems.mat-expanded app-navigation-menu-item');
  }

  public menuItems(): Locator {
    return this.page.locator('#menuItems');
  }

  public editLinkInput(): Locator {
    return this.page.locator('#editLinkInput');
  }

  public createCustomLinkInput(): Locator {
    return this.page.locator('#customLinkLink');
  }

  public editItemSaveBtn(): Locator {
    return this.page.locator('#editItemSaveBtn');
  }

  public securityGroupsCustomLinkSelector(): Locator {
    return this.page.locator('#editSecurityGroupsSelector');
  }

  public securityGroupsCustomDropdownSelector(): Locator {
    return this.page.locator('#securityGroupsCustomDropdownSelector');
  }

  public securityGroupsValue(): Locator {
    return this.editSecurityGroupsSelector().locator('.ng-value-label');
  }

  public editSecurityGroupsSelector(): Locator {
    return this.page.locator('#editSecurityGroupsSelector');
  }

  public menuItemDropdowns(): Locator {
    return this.page.locator('#menuItemDropdown');
  }

  public dropdownBody(index: number): Locator {
    return this.menuItems().nth(index).locator('#dropdownBody');
  }

  public dropdownBodyChilds(indexDropdown: number): Locator {
    return this.menuItems().nth(indexDropdown).locator('#dropdownBody>*');
  }

  public async editTranslationsOnDropdownBodyChilds(data: {
    indexChildDropdown: number;
    indexDropdownInMenu: number;
    translations_array: string[];
  }) {
    await this.dropdownBodyChilds(data.indexDropdownInMenu)
      .nth(data.indexChildDropdown).locator('#editBtn')
      .click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#editItemSaveBtn').waitFor({ state: 'visible', timeout: 40000 });
    for (const translation of data.translations_array) {
      const i = data.translations_array.indexOf(translation);
      await this.editItemTranslation(
        data.indexDropdownInMenu,
        data.indexChildDropdown,
        i
      ).fill(translation);
      await this.page.waitForTimeout(500);
    }
    await this.editItemSaveBtn().click();
    await this.page.waitForTimeout(500);
  }

  public async collapseMenuItemDropdown(index: number) {
    await this.menuItems().nth(index).locator('.mat-expansion-indicator').click();
  }

  public async dragTemplateOnElementInCreatedDropdown(
    indexTemplate: number,
    indexCreatedDropdown: number,
    indexElementInCreatedDropdown = 0
  ) {
    await this.collapseTemplates(0);
    if ((await this.dropdownBodyChilds(indexCreatedDropdown).count()) === 0) {
      await this.dragHandleOnItemInMainMenu(indexTemplate).dragTo(
        this.dropdownBody(indexCreatedDropdown)
      );
    } else {
      await this.dragHandleOnItemInMainMenu(indexTemplate).dragTo(
        this.dropdownBody(indexCreatedDropdown)
      );
    }
    await this.collapseTemplates(0);
  }

  public async collapseTemplates(indexTemplate: number) {
    await this.dropdownTemplate(indexTemplate).click();
    await this.page.waitForTimeout(2000);
  }

  public mainMenu(): Locator {
    return this.page.locator('#mainMenu');
  }

  public dragHandleOnItemInMainMenu(numberItem: number): Locator {
    return this.page.locator(`#dragHandle0_${numberItem}`);
  }

  public async dragAndDropElementOfDropdown(
    indexDropdownInMenuItems: number,
    indexItemForSwap: number,
    indexItemOfSwap: number
  ) {
    const elem = this.page.locator(`#drag_handle${indexDropdownInMenuItems}_${indexItemForSwap}`);
    await elem.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000);
    await this.page.waitForTimeout(2000);
    await elem.dragTo(
      this.page.locator(`#drag_handle${indexDropdownInMenuItems}_${indexItemOfSwap}`)
    );
    await this.page.waitForTimeout(2000);
  }

  public async createMenuItemFromTemplate(indexItemInTemplate: number) {
    const currentDropDrownBodyCount = await this.menuItems().count();
    const elem = this.dragHandleOnItemInMainMenu(indexItemInTemplate);
    const toElement = this.page.locator('mat-card > mat-accordion').first();
    await elem.dragTo(toElement);
  }

  public dropdownTemplate(indexTemplate: number): Locator {
    return this.page.locator('#menuTemplate').nth(indexTemplate);
  }

  public async clickSaveMenuBtn() {
    const navigationMenuSaveBtn = this.page.locator('#navigationMenuSaveBtn');
    await navigationMenuSaveBtn.scrollIntoViewIfNeeded();
    await navigationMenuSaveBtn.waitFor({ state: 'visible', timeout: 40000 });
    await navigationMenuSaveBtn.click();
    // waitForSpinnerHide - BasePage method not available here directly
    // Caller should handle spinner
  }

  public async openOnEditCreatedMenuItem(indexInCreatedMenuItems: number) {
    await this.menuItems().nth(indexInCreatedMenuItems).locator('#editBtn').click();
    await this.page.locator('#editItemSaveBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public editItemTranslation(
    firstLevelIndex: number,
    secondLevelIndex: number,
    translationIndex: number
  ): Locator {
    return this.page.locator(`#editItemTranslation${firstLevelIndex}_${secondLevelIndex}_${translationIndex}`);
  }

  public async resetMenu() {
    await this.page.waitForTimeout(1100);
    await this.page.waitForTimeout(1200);
    await this.page.waitForTimeout(1400);
    const resetBtn = this.page.locator('#resetBtn');
    await resetBtn.scrollIntoViewIfNeeded();
    await resetBtn.waitFor({ state: 'visible', timeout: 90000 });
    await resetBtn.click();
    await this.page.waitForTimeout(500);
    const deleteWorkerDeleteBtn = this.page.locator('#deleteWorkerDeleteBtn');
    await deleteWorkerDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await deleteWorkerDeleteBtn.click();
    await this.page.waitForTimeout(500);
  }

  public async deleteElementFromMenuItems(indexElementInMenu: number) {
    const deleteBtn = this.menuItems().nth(indexElementInMenu).locator('#deleteBtn');
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
    await deleteBtn.click();
    await this.page.waitForTimeout(500);
    const menuItemDeleteBtn = this.page.locator('#menuItemDeleteBtn');
    await menuItemDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await menuItemDeleteBtn.click();
  }

  public async deleteElementFromDropdown(indexDropdown: number, indexInDropdown: number) {
    const deleteBtn = this.dropdownBodyChilds(indexDropdown).nth(indexInDropdown).locator('#deleteBtn');
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await deleteBtn.click();
    await this.page.waitForTimeout(500);
    const menuItemDeleteBtn = this.page.locator('#menuItemDeleteBtn');
    await menuItemDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await menuItemDeleteBtn.click();
    await this.page.waitForTimeout(500);
    await this.collapseMenuItemDropdown(indexDropdown);
    await this.page.waitForTimeout(500);
  }

  public async createCustomLinkTranslation(index: number, value: string) {
    await this.page.locator(`#linkTranslation${index}`).fill(value);
  }

  public async createCustomDropdownTranslation(index: number, value: string) {
    await this.page.locator(`#dropdownTranslation${index}`).fill(value);
  }

  public async setSecurityGroupCustomLinkSelector(textSecurityGroup: string) {
    await this.securityGroupsCustomLinkSelector().click();
    await this.page.waitForTimeout(500);
    await this.page.locator(
      `//*[@id="securityGroupsCustomLinkSelector"]//*[text()="${textSecurityGroup}"]`
    ).click();
    await this.page.waitForTimeout(500);
  }

  public async setSecurityGroupCustomDropdownSelector(textSecurityGroup: string) {
    await this.securityGroupsCustomDropdownSelector().click();
    await this.page.locator(
      `//*["ng-dropdown-panel"]//*[text()="${textSecurityGroup}"]`
    ).click();
    await this.page.waitForTimeout(500);
  }

  public async selectCustomLink() {
    await this.page.locator('#addCustomLink').click();
    await this.page.locator('#customLinkCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public async selectCustomDropdown() {
    const el = this.page.locator('#addCustomDropdown');
    await el.waitFor({ state: 'visible', timeout: 40000 });
    await el.click();
  }

  public async createCustomLink(data: {
    securityGroups: string[];
    link: string;
    translations: string[];
  }) {
    await this.selectCustomLink();
    await this.page.locator('#customLinkCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
    if (data.securityGroups.length > 0) {
      for (const securityGroup of data.securityGroups) {
        await this.setSecurityGroupCustomDropdownSelector(securityGroup);
      }
    }
    await this.createCustomLinkInput().fill(data.link);
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await this.createCustomLinkTranslation(i, translation);
      }
    }
    await this.page.locator('#customLinkCreateBtn').scrollIntoViewIfNeeded();
    await this.page.locator('#customLinkCreateBtn').click();
  }

  public async createCustomDropdown(data: {
    securityGroups: string[];
    translations: string[];
  }) {
    await this.selectCustomDropdown();
    await this.page.locator('#customDropdownCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
    if (data.securityGroups.length > 0) {
      for (const securityGroup of data.securityGroups) {
        await this.setSecurityGroupCustomDropdownSelector(securityGroup);
      }
    }
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await this.createCustomDropdownTranslation(i, translation);
      }
    }
    await this.page.locator('#customDropdownCreateBtn').scrollIntoViewIfNeeded();
    await this.page.locator('button#customDropdownCreateBtn').click();
  }

  public async editCustomLink(
    data: { securityGroups: string[]; link: string; translations: string[] },
    indexInCreated: number
  ) {
    await this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.securityGroups.length > 0) {
      await this.editSecurityGroupsValue(data.securityGroups);
    }
    await this.editLinkInput().fill(data.link);
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await this.editItemTranslation(indexInCreated, 0, i).fill(translation);
      }
    }
    await this.editItemSaveBtn().click();
  }

  public async editCustomDropdown(
    data: { securityGroups: string[]; translations: string[] },
    indexInCreated: number
  ) {
    await this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.securityGroups.length > 0) {
      await this.editSecurityGroupsValue(data.securityGroups);
    }
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await this.editItemTranslation(indexInCreated, 0, i).fill(translation);
      }
    }
    await this.editItemSaveBtn().click();
  }

  public async deleteSecurityGroupsInEditItem() {
    const count = await this.securityGroupsValue().count();
    for (let i = 0; i < count; i++) {
      await this.editSecurityGroupsSelector().locator('.ng-value span').click();
    }
  }

  public async editSecurityGroupsValue(securityGroups: string[]) {
    await this.deleteSecurityGroupsInEditItem();
    for (const textSecurityGroup of securityGroups) {
      await this.editSecurityGroupsSelector().click();
      await this.page.locator(
        `//*["ng-dropdown-panel"]//*[text()="${textSecurityGroup}"]`
      ).click();
      await this.page.waitForTimeout(500);
    }
  }

  public async editTemplateItem(
    data: { link: string; translations: string[] },
    indexInCreated: number
  ) {
    await this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.link) {
      await this.editLinkInput().fill(data.link);
    }
    for (const translation of data.translations) {
      const i = data.translations.indexOf(translation);
      if (translation) {
        await this.editItemTranslation(indexInCreated, 0, i).fill(translation);
        await this.page.waitForTimeout(500);
      }
    }
    await this.editItemSaveBtn().click();
    await this.page.waitForTimeout(500);
    await this.clickSaveMenuBtn();
    await this.page.waitForTimeout(500);
  }

  public async verifyMenuItemDataLoaded(menuItemIndex: number) {
    await this.openOnEditCreatedMenuItem(menuItemIndex);
    await this.page.waitForTimeout(500);
    await this.editItemSaveBtn().click();
    await this.page.waitForTimeout(500);
  }
}
