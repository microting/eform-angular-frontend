import { PageWithNavbarPage } from './PageWithNavbar.page';

export class SelectableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  // Navigation
  public goToEntitySelectPage() {
    this.Navbar.goToEntitySelect();
  }

  // Element selectors
  public entitySelectCreateBtn() {
    return cy.get('#entitySelectCreateBtn');
  }

  public entitySelectCreateName() {
    return cy.get('#editName');
  }

  public entitySelectCreateDescription() {
    return cy.get('#editDescription');
  }

  public entitySelectCreateImportListBtn() {
    return cy.get('#editEntitySearchImportBtn');
  }

  public entitySelectCreateSingleItemBtn() {
    return cy.get('#addSingleEntitySelectableItem');
  }

  public entitySelectCreateSaveBtn() {
    return cy.get('#entityCreateSaveBtn');
  }

  public entitySelectCreateCancelBtn() {
    return cy.get('#entitySearchUpdateCancelBtn');
  }

  public entitySelectEditName() {
    return cy.get('#editName');
  }

  public entitySelectEditDescription() {
    return cy.get('#editDescription');
  }

  public entitySelectEditImportListBtn() {
    return cy.get('#editEntitySearchImportBtn');
  }

  public entitySelectEditSingleItemBtn() {
    return cy.get('#editEntitySelectCreateItem');
  }

  public entitySelectEditSaveBtn() {
    return cy.get('#entityUpdateSaveBtn');
  }

  public entitySelectEditCancelBtn() {
    return cy.get('#entitySearchUpdateCancelBtn');
  }

  public entitySelectImportTextArea() {
    return cy.get('#entityImportTextArea');
  }

  public entitySelectImportSaveBtn() {
    return cy.get('#entityImportSaveBtn');
  }

  public entitySelectImportCancelBtn() {
    return cy.get('#entityImportCancelBtn');
  }

  public entitySelectDeleteDeleteBtn() {
    return cy.get('#entitySelectDeleteDeleteBtn');
  }

  public entitySelectDeleteCancelBtn() {
    return cy.get('#entitySelectDeleteCancelBtn');
  }

  public entitySelectEditItemNameBox() {
    return cy.get('#entityItemEditNameBox');
  }

  public entitySelectEditItemSaveBtn() {
    return cy.get('#entityItemSaveBtn');
  }

  public entitySelectEditItemCancelBtn() {
    return cy.get('#entityItemCancelBtn');
  }

  public entityItemEditBtn() {
    return cy.get('.entityItemEditBtn');
  }

  public entityItemDeleteBtn() {
    return cy.get('.entityItemDeleteBtn');
  }

  public firstEntityItemName() {
    return cy.get('.createEntityItemName');
  }

  public idTableHeader() {
    return cy.get('#idTableHeader');
  }

  public nameTableHeader() {
    return cy.get('#nameTableHeader');
  }

  public descriptionTableHeader() {
    return cy.get('#descriptionTableHeader');
  }

  // Row and item operations
  public rowNum() {
    return cy.get('tbody > tr').its('length');
  }

  public itemsEditPageCount() {
    return cy.get('app-entity-list-elements .d-flex').its('length');
  }

  public itemsCreatePageCount() {
    return cy.get('.createEntityItemName').its('length');
  }

  public getFirstRowObject() {
    return cy.get('tbody > tr').first().then($row => {
      const id = $row.find('.id').text();
      const name = $row.find('.name').text();
      const description = $row.find('.description').text();
      return {
        id: id,
        name: name,
        description: description,
        editBtn: cy.get('button.entitySelectEditBtn').first(),
        deleteBtn: cy.get('button.entitySelectDeleteBtn').first()
      };
    });
  }

  public getLastRowObject() {
    return cy.get('tbody > tr').last().then($row => {
      const id = $row.find('.id').text();
      const name = $row.find('.name').text();
      const description = $row.find('.description').text();
      return {
        id: id,
        name: name,
        description: description,
        editBtn: cy.get('button.entitySelectEditBtn').last(),
        deleteBtn: cy.get('button.entitySelectDeleteBtn').last()
      };
    });
  }

  // Create operations
  public createSelectableList_NoItem(name: string, description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSelectableList_OneItem(name: string, itemName: string, description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateSingleItemBtn().click();
    cy.wait(250);
    this.entityItemEditBtn().click();
    this.entitySelectEditItemNameBox().clear().type(itemName);
    this.entitySelectEditItemSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSelectableList_MultipleItems(name: string, itemNames: string[], description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateImportListBtn().click();
    cy.wait(250);
    this.entitySelectImportTextArea().click().type(itemNames.join(''));
    cy.wait(250);
    this.entitySelectImportSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSelectableList_NoItem_Cancels(name: string, description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateCancelBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(250);
  }

  public createSelectableList_OneItem_Cancels(name: string, itemName: string, description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateSingleItemBtn().click();
    cy.wait(250);
    this.entityItemEditBtn().click();
    this.entitySelectEditItemNameBox().clear().type(itemName);
    this.entitySelectEditItemSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateCancelBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSelectableList_MultipleItems_Cancels(name: string, itemNames: string[], description?: string) {
    this.entitySelectCreateBtn().click();
    cy.wait(250);
    this.entitySelectCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    if (description) {
      this.entitySelectCreateDescription().clear().type(description);
      cy.wait(250);
    }
    this.entitySelectCreateImportListBtn().click();
    cy.wait(250);
    this.entitySelectImportTextArea().click().type(itemNames.join(''));
    cy.wait(250);
    this.entitySelectImportSaveBtn().click();
    cy.wait(250);
    this.entitySelectCreateCancelBtn().click();
    cy.wait(250);
    this.entitySelectCreateBtn().should('be.visible', { timeout: 90000 });
    cy.wait(250);
  }

  // Edit operations
  public editSelectableListNameOnly(newName: string) {
    this.rowNum().then(count => {
      cy.get('button.entitySelectEditBtn').eq(count - 1).click();
      cy.wait(250);
      this.entitySelectEditName().should('be.visible').clear().type(newName);
      cy.wait(250);
      this.entitySelectEditSaveBtn().click();
      cy.wait(250);
    });
  }

  public editSelectableListNameAndItem(newName: string, newItemName: string) {
    this.rowNum().then(count => {
      cy.get('button.entitySelectEditBtn').eq(count - 1).click();
      cy.wait(250);
      this.entitySelectEditName().should('be.visible').clear().type(newName);
      cy.wait(250);
      this.editItemName(newItemName);
      cy.wait(250);
      this.entitySelectEditSaveBtn().click();
      cy.wait(250);
    });
  }

  public deleteItemFromList() {
    this.rowNum().then(count => {
      cy.get('button.entitySelectEditBtn').eq(count - 1).click();
      cy.wait(250);
      this.entitySelectEditName().should('be.visible');
      this.deleteItem();
      cy.wait(250);
      this.entitySelectEditSaveBtn().click();
      cy.wait(250);
    });
  }

  // Delete operations
  public deleteList() {
    cy.get('button.entitySelectDeleteBtn').first().click();
    this.entitySelectDeleteDeleteBtn().click();
    cy.wait(500);
  }

  // Helper methods
  public editItemName(newItemName: string) {
    this.entityItemEditBtn().first().click();
    this.entitySelectEditItemNameBox().clear().type(newItemName);
    cy.wait(250);
    this.entitySelectEditItemSaveBtn().click();
  }

  public deleteItem() {
    this.entityItemDeleteBtn().first().click();
  }

  public cleanup() {
    cy.get('button.entitySelectDeleteBtn').first().then($btn => {
      if ($btn.length > 0) {
        this.waitForSpinnerHide();
        cy.wrap($btn).click();
        this.waitForSpinnerHide();
        this.entitySelectDeleteDeleteBtn().click();
        this.waitForSpinnerHide();
      }
    });
  }

  public waitForSpinnerHide() {
    cy.get('#spinner-animation', { timeout: 90000 }).should('not.exist');
  }
}

const selectableListsPage = new SelectableListsPage();
export default selectableListsPage;
