import {PageWithNavbarPage} from './PageWithNavbar.page';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get entitySelectCreateBtn() {
    return browser.element('#entitySelectCreateBtn');
  }

  public get entitySelectSearchField() {
    return browser.element('#labelInput');
  }

  public get entitySelectCreateName() {
    return browser.element('#createName');
  }

  public get entitySelectCreateImportListBtn() {
    return browser.element('#importEntitySelectBtn');
  }

  public get entitySelectCreateSingleItemBtn() {
    return browser.element('#addSingleEntitySelectableItem');
  }

  public get entitySelectCreateSaveBtn() {
    return browser.element('#createEntitySelectSaveBtn');
  }

  public get entitySelectCreateCancelBtn() {
    return browser.element('#createEntitySelectCancelBtn');
  }

  public get entitySelectEditName() {
    return browser.element('#editName');
  }

  public get entitySelectEditImportListBtn() {
    return browser.element('#editEntitySelectImportBtn');
  }

  public get entitySelectEditSingleItemBtn() {
    return browser.element('#editEntitySelectCreateItem');
  }

  public get entitySelectEditSaveBtn() {
    return browser.element('#editEntitySelectSaveBtn');
  }

  public get entitySelectEditCancelBtn() {
    return browser.element('#editEntitySelectCancelBtn');
  }

  public get entitySelectImportTextArea() {
    return browser.element('#entityImportTextArea');
  }

  public get entitySelectImportSaveBtn() {
    return browser.element('#entityImportSaveBtn');
  }

  public get  entitySelectImportCancelBtn() {
    return browser.element('#entityImportCancelBtn');
  }

  public get entitySelectDeleteDeleteBtn() {
    return browser.element('#entitySelectDeleteDeleteBtn');
  }

  public get entitySelectDeleteCancelBtn() {
    return browser.element('#entitySelectDeleteCancelBtn');
  }
}
