class NavigationMenuPage {
  public async menuItemsChilds(): Promise<WebdriverIO.ElementArray> {
    await browser.pause(1000);
    return $$('#menuItems>*');
  }

  public async menuItems(): Promise<WebdriverIO.Element> {
    return $('#menuItems');
  }

  public async editLinkInput(): Promise<WebdriverIO.Element> {
    return $('#editLinkInput');
  }

  public async createCustomLinkInput(): Promise<WebdriverIO.Element> {
    const ele = $('#customLinkLink');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editItemSaveBtn(): Promise<WebdriverIO.Element> {
    await (await $('#editItemSaveBtn')).waitForClickable({ timeout: 40000 });
    return $('#editItemSaveBtn');
  }

  public async securityGroupsCustomLinkSelector(): Promise<WebdriverIO.Element> {
    return $('#securityGroupsCustomLinkSelector');
  }

  public async securityGroupsCustomDropdownSelector(): Promise<WebdriverIO.Element> {
    return $('#securityGroupsCustomDropdownSelector');
  }

  public async securityGroupsValue(): Promise<WebdriverIO.ElementArray> {
    return await (await this.editSecurityGroupsSelector()).$$('.ng-value-label');
  }

  public async editSecurityGroupsSelector(): Promise<WebdriverIO.Element> {
    return $('#editSecurityGroupsSelector');
  }

  public async menuItemDropdowns(): Promise<WebdriverIO.ElementArray> {
    return $$('#menuItemDropdown');
  }

  public async dropdownBody(index: number) {
    return await (await this.menuItemsChilds())[index].$('#dropdownBody');
  }

  public async dropdownBodyChilds(indexDropdown: number) {
    return await (await this.menuItemsChilds())[indexDropdown].$$('#dropdownBody>*');
  }

  public async editTranslationsOnDropdownBodyChilds(data: {
    indexChildDropdown: number;
    indexDropdownInMenu: number;
    translations_array: string[];
  }) {
    await (await (await this.dropdownBodyChilds(data.indexDropdownInMenu))
      [data.indexChildDropdown].$('#editBtn'))
      .click();
    await (await $('#editMenuEntry')).waitForDisplayed({ timeout: 40000 });
    for (const translation of data.translations_array) {
      const i = data.translations_array.indexOf(translation);
      await (await this.editItemTranslation(
        data.indexDropdownInMenu,
        data.indexChildDropdown,
        i
      )).setValue(translation);
    }
    await (await this.editItemSaveBtn()).click();
  }

  public async collapseMenuItemDropdown(index: number) {
    await (await (await this.menuItemsChilds())[index].$('#collapseToggle')).click();
  }

  public async dragTemplateOnElementInCreatedDropdown(
    indexTemplate: number,
    indexCreatedDropdown: number,
    indexElementInCreatedDropdown = 0
  ) {
    await this.collapseTemplates(0);
    if ((await this.dropdownBodyChilds(indexCreatedDropdown)).length === 0) {
      await (await this.dragHandleOnItemInMainMenu(indexTemplate)).dragAndDrop(
        await this.dropdownBody(indexCreatedDropdown)
      );
    } else {
      await (await this.dragHandleOnItemInMainMenu(indexTemplate)).dragAndDrop(
        (await this.dropdownBodyChilds(indexCreatedDropdown))[
          indexElementInCreatedDropdown
        ]
      );
    }
    await this.collapseTemplates(0);
  }

  public async collapseTemplates(indexTemplate) {
    await (await (await this.dropdownTemplate(indexTemplate)).$('app-eform-collapse-toggle')).click();
    // waiting for the menu to open. Menu not have id or any universal selector.
    await browser.pause(1500);
  }

  public async mainMenu(): Promise<WebdriverIO.Element> {
    return $('#mainMenu');
  }

  public async dragHandleOnItemInMainMenu(numberItem): Promise<WebdriverIO.Element> {
    return await (await this.mainMenu()).$(`#dragHandle0_${numberItem}`);
  }

  public async dragAndDropElementOfDropdown(
    indexDropdownInMenuItems,
    indexItemForSwap,
    indexItemOfSwap
  ) {
    const elem = await (await this.menuItemsChilds())[indexDropdownInMenuItems].$(
      `#drag_handle${indexDropdownInMenuItems}_${indexItemForSwap}`
    );
    await elem.scrollIntoView();
    await browser.pause(2000);

    await elem.dragAndDrop(
      await (await this.menuItemsChilds())[indexDropdownInMenuItems].$(
        `#drag_handle${indexDropdownInMenuItems}_${indexItemOfSwap}`
      )
    );
  }

  public async createMenuItemFromTemplate(indexItemInTemplate) {
    await (await this.dragHandleOnItemInMainMenu(indexItemInTemplate)).dragAndDrop(
      (await this.menuItemsChilds())[0]
    );
  }

  public async dropdownTemplate(indexTemplate) {
    return (await $$('#menuTemplate'))[indexTemplate];
  }

  public async clickSaveMenuBtn() {
    const navigationMenuSaveBtn = await $('#navigationMenuSaveBtn');
    await navigationMenuSaveBtn.scrollIntoView();
    await navigationMenuSaveBtn.waitForClickable({ timeout: 40000 });
    await navigationMenuSaveBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  }

  public async openOnEditCreatedMenuItem(indexInCreatedMenuItems) {
    await (await (await this.menuItemsChilds())[indexInCreatedMenuItems].$('#editBtn')).click();
    await (await $('#editMenuEntry')).waitForDisplayed({ timeout: 40000 });
  }

  public async editItemTranslation(
    firstLevelIndex,
    secondLevelIndex,
    translationIndex
  ) {
    const ele = await $(`#editItemTranslation${firstLevelIndex}_${secondLevelIndex}_${translationIndex}`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async resetMenu() {
    const resetBtn = await $('#resetBtn');
    await resetBtn.scrollIntoView();
    await resetBtn.waitForClickable({ timeout: 40000 });
    await resetBtn.click();
    await (await $('#resetModal')).waitForDisplayed({ timeout: 40000 });
    const deleteWorkerDeleteBtn = await $('#deleteWorkerDeleteBtn');
    await deleteWorkerDeleteBtn.waitForDisplayed({ timeout: 40000 });
    await deleteWorkerDeleteBtn.waitForClickable({ timeout: 40000 });
    await deleteWorkerDeleteBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  }

  public async deleteElementFromMenuItems(indexElementInMenu) {
    const deleteBtn = await (await this.menuItemsChilds())[indexElementInMenu].$('#deleteBtn');
    await deleteBtn.scrollIntoView();
    await deleteBtn.waitForClickable({ timeout: 40000 });
    await deleteBtn.click();
    const menuItemDeleteBtn = await $('#menuItemDeleteBtn');
    await menuItemDeleteBtn.waitForDisplayed({ timeout: 40000 });
    await menuItemDeleteBtn.waitForClickable({ timeout: 40000 });
    await menuItemDeleteBtn.click();
  }

  public async deleteElementFromDropdown(indexDropdown, indexInDropdown) {
    const deleteBtn = await (await this.dropdownBodyChilds(indexDropdown))[indexInDropdown].$(
      '#deleteBtn'
    );
    await deleteBtn.scrollIntoView();
    await deleteBtn.waitForClickable({ timeout: 40000 });
    await deleteBtn.click();
    const menuItemDeleteBtn = await $('#menuItemDeleteBtn');
    await menuItemDeleteBtn.waitForDisplayed({ timeout: 40000 });
    await menuItemDeleteBtn.waitForClickable({ timeout: 40000 });
    await menuItemDeleteBtn.click();
    await this.collapseMenuItemDropdown(indexDropdown);
  }

  public async createCustomLinkTranslation(index, value) {
    // $(`input#linkTranslation${index}`).waitForDisplayed({timeout: 2000, reverse: true});
    await (await $(`#linkTranslation${index}`)).setValue(value);
  }

  public async createCustomDropdownTranslation(index, value) {
    // $(`input#linkTranslation${index}`).waitForDisplayed({timeout: 2000, reverse: true});
    await (await $(`#dropdownTranslation${index}`)).setValue(value);
  }

  public async setSecurityGroupCustomLinkSelector(textSecurityGroup) {
    await (await this.securityGroupsCustomLinkSelector()).click();
    await (await $(
      `//*[@id="securityGroupsCustomLinkSelector"]//*[text()="${textSecurityGroup}"]`
    )).click();
    await browser.pause(500);
  }

  public async setSecurityGroupCustomDropdownSelector(textSecurityGroup) {
    await (await this.securityGroupsCustomDropdownSelector()).click();
    await (await $(
      `//*[@id="securityGroupsCustomDropdownSelector"]//*[text()="${textSecurityGroup}"]`
    )).click();
    await browser.pause(500);
  }

  public async selectCustomLink() {
    // $('#customLinkCreateBtn').waitForExist({timeout: 2000, reverse: true});
    await (await $('#addCustomLink')).click();
    await (await $('#newLinkModal')).waitForDisplayed({ timeout: 40000 });
  }

  public async selectCustomDropdown() {
    const el = await $('#addCustomDropdown');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 40000 });
    await el.click();
  }

  public async createCustomLink(data: {
    securityGroups: string[];
    link: string;
    translations: string[];
  }) {
    await this.selectCustomLink();
    await (await $('#newLinkModal')).waitForDisplayed({ timeout: 40000 });
    if (data.securityGroups.length > 0) {
      for (const securityGroup of data.securityGroups) {
        await this.setSecurityGroupCustomLinkSelector(securityGroup);
      }
    }
    await (await this.createCustomLinkInput()).setValue(data.link);
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await this.createCustomLinkTranslation(i, translation);
      }
    }
    // $('#customLinkCreateBtn').waitForClickable({timeout: 2000});
    await(await $('#customLinkCreateBtn')).click();
  }

  public async createCustomDropdown(data: {
    securityGroups: string[];
    translations: string[];
  }) {
    await this.selectCustomDropdown();
    await (await $('#newDropdownModal')).waitForDisplayed({ timeout: 40000 });
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

    await (await $('button#customDropdownCreateBtn')).click();
  }

  public async editCustomLink(
    data: { securityGroups: string[]; link: string; translations: string[] },
    indexInCreated: number
  ) {
    await this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.securityGroups.length > 0) {
      await this.editSecurityGroupsValue(data.securityGroups);
    }
    await (await this.editLinkInput()).setValue(data.link);
    if (data.translations.length > 0) {
      for (const translation of data.translations) {
        const i = data.translations.indexOf(translation);
        await (await this.editItemTranslation(indexInCreated, 0, i)).setValue(translation);
      }
    }
    await (await this.editItemSaveBtn()).click();
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
        await (await this.editItemTranslation(indexInCreated, 0, i)).setValue(translation);
      }
    }
    await (await this.editItemSaveBtn()).click();
  }

  public async deleteSecurityGroupsInEditItem() {
    (await this.securityGroupsValue()).forEach(async (_) =>
      await (await (await this.editSecurityGroupsSelector()).$('.ng-value span')).click()
    );
  }

  public async editSecurityGroupsValue(securityGroups: string[]) {
    await this.deleteSecurityGroupsInEditItem();
    for (const textSecurityGroup of securityGroups) {
      await (await (this.editSecurityGroupsSelector())).click();
      await (await $(
        `//*[@id="editSecurityGroupsSelector"]//*[text()="${textSecurityGroup}"]`
      )).click();
      await browser.pause(500);
    }
  }

  public async editTemplateItem(
    data: { link: string; translations: string[] },
    indexInCreated: number
  ) {
    await this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.link) {
      await (await this.editLinkInput()).setValue(data.link);
    }
    for (const translation of data.translations) {
      const i = data.translations.indexOf(translation);
      if (translation) {
        await (await this.editItemTranslation(indexInCreated, 0, i)).setValue(translation);
      }
    }
    await(await this.editItemSaveBtn()).click();
    await this.clickSaveMenuBtn();
  }
}
const navigationMenuPage = new NavigationMenuPage();
export default navigationMenuPage;
