import {PageWithNavbarPage} from './PageWithNavbar.page';
import myEformsPage from './MyEforms.page';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';
import {DeviceUsersRowObject} from './DeviceUsers.page';

class FoldersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newFolderBtn() {
    return $('#newFolderBtn');
  }

  public get createNameInput() {
    return $('#name');
  }

  public get createDescriptionInput() {
    return $('#description .pell-content');
  }

  public get saveCreateBtn() {
    return $('#folderSaveBtn');
  }

  public get cancelCreateBtn() {
    return $('#cancelCreateBtn');
  }

  public get saveDeleteBtn() {
    const saveDeleteBtn = $('#saveDeleteBtn');
    saveDeleteBtn.waitForDisplayed({timeout: 20000});
    saveDeleteBtn.waitForClickable({timeout: 20000});
    return saveDeleteBtn;
  }

  public get cancelDeleteBtn() {
    const ele = $('#cancelDeleteBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get editNameInput() {
    return $('#editNameInput');
  }

  public get editDescriptionInput() {
    const ele = $('#editDescriptionInput .pell-content');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get rowNum(): number {
    if (!$('#folderTreeId').isExisting()) {
      browser.pause(500);
    }
    return $$('#folderTreeId').length;
  }

  public get rowNumParents(): number {
    browser.pause(500);
    return $$('#folderTreeName').length;
  }

  public get rowChildrenNum() {
    return $$('.tree-node-level-2').length;
  }

  getFolder(num): FoldersRowObject {
    return new FoldersRowObject(num);
  }

  getFolderByName(nameFolder: string): FoldersRowObject {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const folder = new FoldersRowObject(i);
      if (folder.name === nameFolder) {
        return folder;
      }
    }
    return null;
  }

  getFolderRowNumByName(nameFolder: string): number {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const folder = new FoldersRowObject(i);
      if (folder.name === nameFolder) {
        return i;
      }
    }
    return -1;
  }

  getFolderFromTree(numParent, numChild): FoldersTreeRowObject {
    return new FoldersTreeRowObject(numParent, numChild);
  }

  public createNewFolder(name: string, description: string, clickCancel = false) {
    this.newFolderBtn.click();
    this.createNameInput.waitForDisplayed({timeout: 10000});
    this.createNameInput.setValue(name);
    this.createDescriptionInput.setValue(description);
    if (!clickCancel) {
      this.saveCreateBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    } else {
      this.cancelCreateBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  public editFolder(folder: FoldersRowObject, name = '', description = '') {
    if (!folder.editBtn.isExisting()) {
      folder.folderElement.click();
      folder.editBtn.waitForDisplayed({timeout: 20000});
    }
    folder.editBtn.click();
    this.editNameInput.waitForDisplayed({timeout: 20000});
    if (name != null) {
      // this.editNameInput.click();
      this.editNameInput.clearValue();
      this.editNameInput.setValue(name);
    }
    if (description != null) {
      // this.editDescriptionInput.click();
      this.editDescriptionInput.clearValue();
      this.editDescriptionInput.setValue(description);
    }
    this.saveEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    this.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  public createFolderChild(rowNum, name = '', description = '') {
    $$('#folderTreeName')[rowNum - 1].click();
    $$('#createFolderChildBtn')[0].waitForDisplayed({timeout: 10000});
    $$('#createFolderChildBtn')[0].click();
    $('#name').waitForDisplayed({timeout: 10000});
    this.createNameInput.setValue(name);
    this.createDescriptionInput.setValue(description);
    this.saveCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public deleteFolderChild(parentRowNum: number, childRowToDelete: number) {
    $$('#folderTreeOpenClose')[parentRowNum - 1].waitForDisplayed({timeout: 10000});
    $$('#folderTreeOpenClose')[parentRowNum - 1].click();
    browser.pause(1000);
    $$('#folderTreeName')[childRowToDelete - 1].waitForDisplayed({timeout: 10000});
    $$('#folderTreeName')[childRowToDelete - 1].click();
    $('#deleteFolderTreeBtn').click();
    this.saveDeleteBtn.click();
  }

  public editFolderChild(folder: FoldersTreeRowObject, name = '', description = '') {
    folder.editTreeBtn.click();
    if (name != null) {
      this.editNameInput.waitForDisplayed({timeout: 20000});
      this.editNameInput.click();
      this.editNameInput.clearValue();
      this.editNameInput.setValue(name);
    }
    if (description != null) {
      this.editDescriptionInput.waitForDisplayed({timeout: 20000});
      this.editDescriptionInput.click();
      this.editDescriptionInput.clearValue();
      this.editDescriptionInput.setValue(description);
    }
    this.saveEditBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
  }

  public editFolderTree(folder: FoldersTreeRowObject, name = '', description = '') {
    if (!folder.editTreeBtn.isExisting()) {
      folder.folderTreeElement.click();
      folder.editTreeBtn.waitForDisplayed({timeout: 20000});
    }
    folder.editTreeBtn.click();
    $('#editNameInput').waitForDisplayed({timeout: 20000});
    if (name != null) {
      this.editNameInput.click();
      this.editNameInput.clearValue();
      this.editNameInput.setValue(name);
    }
    if (description != null) {
      this.editDescriptionInput.click();
      this.editDescriptionInput.clearValue();
      this.editDescriptionInput.setValue(description);
    }
    this.saveEditBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
  }
}

const foldersPage = new FoldersPage();
export default foldersPage;

export class FoldersRowObject {
  constructor(rowNum) {
    if ($$('.tree-node-level-1')[rowNum - 1]) {
      const element = $$('.tree-node-level-1')[rowNum - 1];
      try {
        this.folderElement = element.$('#folderTreeId');
      } catch (e) {
      }
      try {
        this.name = element.$('#folderTreeName').getText();
      } catch (e) {
      }
      // try {
      //   this.description = element.$('#folderTreeDescription').getText();
      // } catch (e) {
      // }
      this.folderTreeOpenClose = element.$('#folderTreeOpenClose');
      this.editBtn = this.folderElement.$('#editFolderTreeBtn');
      this.deleteBtn = this.folderElement.$('#deleteFolderTreeBtn');
      this.createFolderChildBtn = this.folderElement.$('#createFolderChildBtn');
    }
  }

  folderElement;
  name;
  // description;
  editBtn;
  deleteBtn;
  createFolderChildBtn;
  folderTreeOpenClose;

  getDescription(): string {
    this.openEditModal();
    const description = foldersPage.editDescriptionInput.getText();
    foldersPage.cancelEditBtn.click();
    return description;
  }

  createChild(name = '', description = '', clickCancel = false) {
    if (!this.createFolderChildBtn.isExisting()) {
      this.folderElement.click();
      this.createFolderChildBtn.waitForDisplayed({timeout: 20000});
    }
    this.createFolderChildBtn.click();
    foldersPage.createNameInput.waitForDisplayed({timeout: 10000});
    foldersPage.createNameInput.setValue(name);
    foldersPage.createDescriptionInput.setValue(description);
    if (!clickCancel) {
      foldersPage.saveCreateBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    } else {
      foldersPage.cancelCreateBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  delete(clickCancel = false) {
    if (!this.deleteBtn.isExisting()) {
      this.folderElement.click();
      this.deleteBtn.waitForDisplayed({timeout: 20000});
    }
    this.deleteBtn.click();
    if (!clickCancel) {
      foldersPage.saveDeleteBtn.waitForClickable({timeout: 20000});
      foldersPage.saveDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 2000, reverse: true});
    } else {
      foldersPage.cancelDeleteBtn.waitForDisplayed({timeout: 20000});
      foldersPage.cancelDeleteBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  openEditModal() {
    if (!this.editBtn.isExisting()) {
      this.folderElement.click();
      this.editBtn.waitForDisplayed({timeout: 20000});
    }
    this.editBtn.click();
    foldersPage.cancelEditBtn.waitForDisplayed({timeout: 20000});
  }

  editFolder(name = '', description = '', clickCancel = false) {
    this.openEditModal();
    foldersPage.editNameInput.waitForDisplayed({timeout: 20000});
    if (name != null) {
      foldersPage.editNameInput.clearValue();
      foldersPage.editNameInput.setValue(name);
    }
    if (description != null) {
      foldersPage.editDescriptionInput.clearValue();
      foldersPage.editDescriptionInput.setValue(description);
    }
    if (!clickCancel) {
      foldersPage.saveEditBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    } else {
      foldersPage.cancelEditBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  collapseChildren() {
    if (this.folderTreeOpenClose.$('fa-icon[icon="folder-open"]')) {
      this.folderTreeOpenClose.click();
    }
  }

  expandChildren() {
    if (this.folderTreeOpenClose.$('fa-icon[icon="folder"]')) {
      this.folderTreeOpenClose.click();
    }
  }
}

export class FoldersTreeRowObject {
  constructor(rowNumFolderParent, rowNumberFolderChildren) {
    if ($$('.tree-node-level-1')[rowNumFolderParent - 1].$$('.tree-node-level-2')[rowNumberFolderChildren - 1]) {
      const element = $$('.tree-node-level-1')[rowNumFolderParent - 1].$$('.tree-node-level-2')[rowNumberFolderChildren - 1];
      try {
        this.folderTreeElement = element.$('#folderTreeId');
      } catch (e) {
      }
      try {
        this.nameTree = element.$('#folderTreeName').getText();
      } catch (e) {
      }
      // try {
      //   this.descriptionTree = element.$$('#folderTreeDescription')[rowNumberFolderChildren - 1].getText();
      // } catch (e) {
      // }
      this.editTreeBtn = element.$('#editFolderTreeBtn');
      this.deleteTreeBtn = element.$('#deleteFolderTreeBtn');
    }
  }

  folderTreeElement;
  nameTree;
  // descriptionTree;
  editTreeBtn;
  deleteTreeBtn;

  getDescription(): string {
    this.openEditModal();
    const description = foldersPage.editDescriptionInput.getText();
    foldersPage.cancelEditBtn.click();
    return description;
  }

  delete(clickCancel = false) {
    if (!this.deleteTreeBtn.isExisting()) {
      this.folderTreeElement.click();
      this.deleteTreeBtn.waitForDisplayed({timeout: 20000});
    }
    this.deleteTreeBtn.click();
    if (!clickCancel) {
      foldersPage.saveDeleteBtn.waitForClickable({timeout: 20000});
      foldersPage.saveDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 2000, reverse: true});
    } else {
      foldersPage.cancelDeleteBtn.waitForClickable({timeout: 20000});
      foldersPage.cancelDeleteBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }

  openEditModal() {
    if (!this.editTreeBtn.isExisting()) {
      this.folderTreeElement.click();
      this.editTreeBtn.waitForDisplayed({timeout: 20000});
    }
    this.editTreeBtn.click();
    foldersPage.saveEditBtn.waitForDisplayed({timeout: 20000});
  }

  editFolderChild(name = '', description = '', clickCancel = false) {
    this.openEditModal();
    if (name != null) {
      foldersPage.editNameInput.clearValue();
      foldersPage.editNameInput.setValue(name);
    }
    if (description != null) {
      foldersPage.editDescriptionInput.clearValue();
      foldersPage.editDescriptionInput.setValue(description);
    }
    if (!clickCancel) {
      foldersPage.saveEditBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    } else {
      foldersPage.cancelEditBtn.click();
    }
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  }
}
