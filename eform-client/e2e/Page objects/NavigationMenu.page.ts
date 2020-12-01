class NavigationMenuPage {

  public get menuItemsChilds() {
    return $$('#menuItems>*');
  }

  public get menuItems() {
    return $('#menuItems');
  }

  public get editLinkInput() {
    return $('#editLinkInput');
  }

  public get createCustomLinkInput() {
    return $('#customLinkLink');
  }

  public get editItemSaveBtn() {
    $('#editItemSaveBtn').waitForClickable({timeout: 20000});
    return $('#editItemSaveBtn');
  }

  public get securityGroupsCustomLinkSelector() {
    return $('#securityGroupsCustomLinkSelector');
  }

  public get securityGroupsCustomDropdownSelector() {
    return $('#securityGroupsCustomDropdownSelector');
  }

  public get securityGroupsValue() {
    return this.editSecurityGroupsSelector.$$('.ng-value-label');
  }

  public get editSecurityGroupsSelector() {
    return $('#editSecurityGroupsSelector');
  }

  public get menuItemDropdowns() {
    return $$('#menuItemDropdown');
  }

  public dropdownBody(index: number) {
    return this.menuItemsChilds[index].$('#dropdownBody');
  }

  public dropdownBodyChilds(indexDropdown: number) {
    return this.menuItemsChilds[indexDropdown].$$('#dropdownBody>*');
  }

  public editTranslationsOnDropdownBodyChilds(data: { indexChildDropdown: number,
    indexDropdownInMenu: number, translations_array: string[] }) {
    this.dropdownBodyChilds(data.indexDropdownInMenu)[data.indexChildDropdown].$('#editBtn').click();
    data.translations_array.forEach((translation, i) =>
      this.editItemTranslation(data.indexDropdownInMenu, data.indexChildDropdown, i).setValue(translation));
    this.editItemSaveBtn.click();
  }

  public collapseMenuItemDropdown(index: number) {
    this.menuItemsChilds[index].$('#collapseToggle').click();
  }

  public dragTemplateOnElementInCreatedDropdown(indexTemplate: number, indexCreatedDropdown: number, indexElementInCreatedDropdown= 0) {
    this.collapseTemplates(0);
    if (this.dropdownBodyChilds(indexCreatedDropdown).length === 0) {
      this.dragHandleOnItemInMainMenu(indexTemplate).dragAndDrop(this.dropdownBody(indexCreatedDropdown));
    } else {
      this.dragHandleOnItemInMainMenu(indexTemplate)
        .dragAndDrop(this.dropdownBodyChilds(indexCreatedDropdown)[indexElementInCreatedDropdown]);
    }
    this.collapseTemplates(0);
  }

  public collapseTemplates(indexTemplate) {
    this.dropdownTemplate(indexTemplate).$('app-eform-collapse-toggle').click();
  }

  public get mainMenu() {
    return $('#mainMenu');
  }

  public dragHandleOnItemInMainMenu(numberItem) {
    return this.mainMenu.$(`#dragHandle0_${numberItem}`);
  }

  public dragAndDropElementOfDropdown(indexDropdownInMenuItems, indexItemForSwap, indexItemOfSwap) {
    const elem = this.menuItemsChilds[indexDropdownInMenuItems]
      .$(`#drag_handle${indexDropdownInMenuItems}_${indexItemForSwap}`);
    elem.scrollIntoView();
    browser.pause(2000);

    elem.dragAndDrop(this.menuItemsChilds[indexDropdownInMenuItems].$(`#drag_handle${indexDropdownInMenuItems}_${indexItemOfSwap}`));
  }

  public createMenuItemFromTemplate(indexItemInTemplate) {
    this.dragHandleOnItemInMainMenu(indexItemInTemplate).dragAndDrop(this.menuItemsChilds[0]);
  }

  public dropdownTemplate(indexTemplate) {
    return $$('#menuTemplate')[indexTemplate];
  }

  public clickSaveMenuBtn() {
    const navigationMenuSaveBtn = $('#navigationMenuSaveBtn');
    navigationMenuSaveBtn.scrollIntoView();
    navigationMenuSaveBtn.waitForClickable({timeout: 20000});
    navigationMenuSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
  }

  public openOnEditCreatedMenuItem(indexInCreatedMenuItems) {
    this.menuItemsChilds[indexInCreatedMenuItems].$('#editBtn').click();
    $('#editMenuEntry').waitForDisplayed({timeout: 20000});
  }

  public editItemTranslation(firstLevelIndex, secondLevelIndex, translationIndex) {
    return $(`#editItemTranslation${firstLevelIndex}_${secondLevelIndex}_${translationIndex}`);
  }

  public resetMenu() {
    const resetBtn = $('#resetBtn');
    resetBtn.scrollIntoView();
    resetBtn.waitForClickable({timeout: 20000});
    resetBtn.click();
    $('#resetModal').waitForDisplayed({timeout: 20000});
    const deleteWorkerDeleteBtn = $('#deleteWorkerDeleteBtn');
    deleteWorkerDeleteBtn.waitForDisplayed({timeout: 20000});
    deleteWorkerDeleteBtn.waitForClickable({timeout: 20000});
    deleteWorkerDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
  }

  public deleteElementFromMenuItems(indexElementInMenu) {
    const deleteBtn = this.menuItemsChilds[indexElementInMenu].$('#deleteBtn');
    deleteBtn.scrollIntoView();
    deleteBtn.waitForClickable({timeout: 20000});
    deleteBtn.click();
    const menuItemDeleteBtn = $('#menuItemDeleteBtn');
    menuItemDeleteBtn.waitForDisplayed({timeout: 20000});
    menuItemDeleteBtn.waitForClickable({ timeout: 20000});
    menuItemDeleteBtn.click();
  }

  public deleteElementFromDropdown(indexDropdown, indexInDropdown) {
    const deleteBtn = this.dropdownBodyChilds(indexDropdown)[indexInDropdown].$('#deleteBtn');
    deleteBtn.scrollIntoView();
    deleteBtn.waitForClickable({timeout: 20000});
    deleteBtn.click();
    const menuItemDeleteBtn = $('#menuItemDeleteBtn');
    menuItemDeleteBtn.waitForDisplayed({timeout: 20000});
    menuItemDeleteBtn.waitForClickable({ timeout: 20000});
    menuItemDeleteBtn.click();
    this.collapseMenuItemDropdown(indexDropdown);
  }

  public createCustomLinkTranslation(index, value) {
    // $(`input#linkTranslation${index}`).waitForDisplayed({timeout: 2000, reverse: true});
    $(`#linkTranslation${index}`).setValue(value);
  }

  public createCustomDropdownTranslation(index, value) {
    // $(`input#linkTranslation${index}`).waitForDisplayed({timeout: 2000, reverse: true});
    $(`#dropdownTranslation${index}`).setValue(value);
  }

  public setSecurityGroupCustomLinkSelector(textSecurityGroup) {
    this.securityGroupsCustomLinkSelector.click();
    $(`//*[@id="securityGroupsCustomLinkSelector"]//*[text()="${textSecurityGroup}"]`).click();
    browser.pause(500);
  }

  public setSecurityGroupCustomDropdownSelector(textSecurityGroup) {
    this.securityGroupsCustomDropdownSelector.click();
    $(`//*[@id="securityGroupsCustomDropdownSelector"]//*[text()="${textSecurityGroup}"]`).click();
    browser.pause(500);
  }

  public selectCustomLink() {
    // $('#customLinkCreateBtn').waitForExist({timeout: 2000, reverse: true});
    $('#addCustomLink').click();
    $('#newLinkModal').waitForDisplayed({timeout: 20000});
  }

  public selectCustomDropdown() {
    // $('#customDropdownCreateBtn').waitForExist({timeout: 2000, reverse: true});
    $('#addCustomDropdown').click();
  }

  public createCustomLink(data: {securityGroups: string[], link: string, translations: string[]}) {
    this.selectCustomLink();
    $('#newLinkModal').waitForDisplayed({timeout: 20000});
    if (data.securityGroups.length > 0) {
      data.securityGroups.forEach(securityGroup => this.setSecurityGroupCustomLinkSelector(securityGroup));
    }
    this.createCustomLinkInput.setValue(data.link);
    if (data.translations.length > 0) {
      data.translations.forEach((translation, i) => this.createCustomLinkTranslation(i, translation));
    }
    // $('#customLinkCreateBtn').waitForClickable({timeout: 2000});
    $('#customLinkCreateBtn').click();
  }

  public createCustomDropdown(data: {securityGroups: string[], translations: string[]}) {
    this.selectCustomDropdown();
    $('#newDropdownModal').waitForDisplayed({timeout: 20000});
    if (data.securityGroups.length > 0) {
      data.securityGroups.forEach(securityGroup => this.setSecurityGroupCustomDropdownSelector(securityGroup));
    }
    if (data.translations.length > 0) {
      data.translations.forEach((translation, i) => this.createCustomDropdownTranslation(i, translation));
    }

    $('button#customDropdownCreateBtn').click();
  }

  public editCustomLink(data: {securityGroups: string[], link: string, translations: string[]}, indexInCreated: number) {
    this.openOnEditCreatedMenuItem(indexInCreated);
    // $('#editMenuEntry').waitForDisplayed({timeout: 20000});
    if (data.securityGroups.length > 0) {
      this.editSecurityGroupsValue(data.securityGroups);
    }
    this.editLinkInput.setValue(data.link);
    if (data.translations.length > 0) {
      data.translations.forEach((translation, i) => this.editItemTranslation(indexInCreated, 0, i)
        .setValue(translation));
    }
    this.editItemSaveBtn.click();
  }

  public editCustomDropdown(data: {securityGroups: string[], translations: string[]}, indexInCreated: number) {
    this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.securityGroups.length > 0) {
      this.editSecurityGroupsValue(data.securityGroups);
    }
    if (data.translations.length > 0) {
      data.translations.forEach((translation, i) => this.editItemTranslation(indexInCreated, 0, i)
        .setValue(translation));
    }
    this.editItemSaveBtn.click();
  }

  public deleteSecurityGroupsInEditItem() {
    this.securityGroupsValue.forEach(_ => this.editSecurityGroupsSelector.$('.ng-value span').click());
  }

  public editSecurityGroupsValue(securityGroups: string[]) {
    this.deleteSecurityGroupsInEditItem();
    securityGroups.forEach(textSecurityGroup => {
      this.editSecurityGroupsSelector.click();
      $(`//*[@id="editSecurityGroupsSelector"]//*[text()="${textSecurityGroup}"]`).click();
      browser.pause(500);
    });
  }

  public editTemplateItem(data: {link: string, translations: string []}, indexInCreated: number) {
    this.openOnEditCreatedMenuItem(indexInCreated);
    if (data.link) {
      this.editLinkInput.setValue(data.link);
    }
    data.translations.forEach((translation, i) => {
      if (translation) {
        this.editItemTranslation(indexInCreated, 0, i).setValue(translation);
      }
    });
    this.editItemSaveBtn.click();
    this.clickSaveMenuBtn();
  }
}
const navigationMenuPage = new NavigationMenuPage();
export default navigationMenuPage;
