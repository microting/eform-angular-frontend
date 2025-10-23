import { PageWithNavbarPage } from './PageWithNavbar.page';

export class SearchableListsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  // Navigation
  public goToEntitySearchPage() {
    this.Navbar.goToEntitySearch();
  }

  // Element selectors
  public createEntitySearchBtn() {
    return cy.get('#createEntitySearchBtn');
  }

  public entitySearchSearchField() {
    return cy.get('#labelInput');
  }

  public entitySearchCreateName() {
    return cy.get('#editName');
  }

  public entitySearchCreateImportBtn() {
    return cy.get('#editEntitySearchImportBtn');
  }

  public entitySearchCreateSingleItemBtn() {
    return cy.get('#addSingleEntitySelectableItem');
  }

  public entitySearchCreateSingleItemEditBtn() {
    return cy.get('.entityItemEditBtn');
  }

  public entitySearchCreateItemNameBox() {
    return cy.get('#entityItemEditNameBox');
  }

  public entitySearchCreateItemSaveBtn() {
    return cy.get('#entityItemSaveBtn');
  }

  public entitySearchCreateItemCancelBtn() {
    return cy.get('#entityItemCancelBtn');
  }

  public entitySearchCreateImportItemTextArea() {
    return cy.get('#entityImportTextArea');
  }

  public entitySearchCreateImportItemSaveBtn() {
    return cy.get('#entityImportSaveBtn');
  }

  public entitySearchCreateImportItemCancelBtn() {
    return cy.get('#entityImportCancelBtn');
  }

  public entitySearchCreateSaveBtn() {
    return cy.get('#entityCreateSaveBtn');
  }

  public entitySearchCreateCancelBtn() {
    return cy.get('#entitySearchUpdateCancelBtn');
  }

  public entitySearchEditBtn(index = 0) {
    return cy.get('#entitySearchUpdateBtn').eq(index);
  }

  public entitySearchEditNameBox() {
    return cy.get('#editName');
  }

  public entitySearchEditImportBtn() {
    return cy.get('#editEntitySearchImportBtn');
  }

  public entitySearchEditSingleItemBtn() {
    return cy.get('#editEntitySearchCreateItem');
  }

  public entitySearchItemEditBtn() {
    return cy.get('.entityItemEditBtn');
  }

  public entitySearchItemDeleteBtn() {
    return cy.get('.entityItemDeleteBtn');
  }

  public entitySearchEditItemNameBox() {
    return cy.get('#entityItemEditNameBox');
  }

  public entitySearchEditItemSaveBtn() {
    return cy.get('#entityItemSaveBtn');
  }

  public entitySearchEditItemCancelBtn() {
    return cy.get('#entityItemCancelBtn');
  }

  public entitySearchEditImportItemTextArea() {
    return cy.get('#entityImportTextArea');
  }

  public entitySearchEditImportItemSaveBtn() {
    return cy.get('#entityImportSaveBtn');
  }

  public entitySearchEditImportItemCancelBtn() {
    return cy.get('#entityImportCancelBtn');
  }

  public entitySearchEditSaveBtn() {
    return cy.get('#entityUpdateSaveBtn');
  }

  public entitySearchEditCancelBtn() {
    return cy.get('#entitySearchUpdateCancelBtn');
  }

  public entitySearchDeleteBtn() {
    return cy.get('#entitySearchDeleteBtn');
  }

  public entitySearchDeleteDeleteBtn() {
    return cy.get('#entitySearchDeleteDeleteBtn');
  }

  public entitySearchDeleteCancelBtn() {
    return cy.get('#entitySearchDeleteCancelBtn');
  }

  public firstEntityItemName() {
    return cy.get('.createEntityItemName');
  }

  // Row and item operations
  public rowNum() {
    return cy.get('tbody > tr').its('length');
  }

  public items() {
    return cy.get('app-entity-search-edit ul li').its('length');
  }

  public getFirstRowObject() {
    return cy.get('tbody > tr').first().then($row => {
      const name = $row.find('#entitySearchName').text();
      return {
        name: name,
        editBtn: cy.get('#entitySearchUpdateBtn').first(),
        deleteBtn: cy.get('#entitySearchDeleteBtn').first()
      };
    });
  }

  // Create operations
  public createSearchableList_NoItem(name: string) {
    this.createEntitySearchBtn().click();
    cy.wait(250);
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    this.entitySearchCreateSaveBtn().click();
    cy.wait(250);
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSearchableList_OneItem(name: string, itemName: string) {
    this.createEntitySearchBtn().click();
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    this.entitySearchCreateSingleItemBtn().click();
    cy.wait(250);
    this.entitySearchCreateSingleItemEditBtn().click();
    this.entitySearchCreateItemNameBox().clear().type(itemName);
    this.entitySearchCreateItemSaveBtn().click();
    cy.wait(250);
    this.entitySearchCreateSaveBtn().click();
    cy.wait(250);
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSearchableList_MultipleItems(name: string, itemNames: string[]) {
    this.createEntitySearchBtn().click();
    cy.wait(250);
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    this.entitySearchCreateImportBtn().click();
    cy.wait(250);
    this.entitySearchCreateImportItemTextArea().click().type(itemNames.join(''));
    cy.wait(250);
    this.entitySearchCreateImportItemSaveBtn().click();
    cy.wait(250);
    this.entitySearchCreateSaveBtn().click();
    cy.wait(250);
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSearchableList_NoItem_Cancels(name: string) {
    this.createEntitySearchBtn().click();
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    this.entitySearchCreateCancelBtn().click();
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
    cy.wait(250);
  }

  public createSearchableList_OneItem_Cancels(name: string, itemName: string) {
    this.createEntitySearchBtn().click();
    cy.wait(250);
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    this.entitySearchCreateSingleItemBtn().click();
    cy.wait(250);
    this.entitySearchCreateSingleItemEditBtn().click();
    cy.wait(250);
    this.entitySearchCreateItemNameBox().clear().type(itemName);
    cy.wait(250);
    this.entitySearchCreateItemSaveBtn().click();
    cy.wait(250);
    this.entitySearchCreateCancelBtn().click();
    cy.wait(250);
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
    cy.wait(1500);
  }

  public createSearchableList_MultipleItems_Cancels(name: string, itemNames: string[]) {
    this.createEntitySearchBtn().click();
    cy.wait(250);
    this.entitySearchCreateName().should('be.visible').clear().type(name);
    cy.wait(250);
    this.entitySearchCreateImportBtn().click();
    cy.wait(250);
    this.entitySearchCreateImportItemTextArea().click().type(itemNames.join(''));
    cy.wait(250);
    this.entitySearchCreateImportItemSaveBtn().click();
    cy.wait(250);
    this.entitySearchCreateCancelBtn().click();
    cy.wait(250);
    this.createEntitySearchBtn().should('be.visible', { timeout: 90000 });
  }

  // Edit operations
  public editSearchableListNameOnly(newName: string) {
    this.rowNum().then(count => {
      const index = count - 1;
      this.entitySearchEditBtn(index).click();
      cy.wait(250);
      this.entitySearchEditNameBox().should('be.visible').clear().type(newName);
      cy.wait(250);
      this.entitySearchEditSaveBtn().click();
      cy.wait(250);
    });
  }

  public editSearchableListNameAndItem(newName: string, newItemName: string) {
    this.rowNum().then(count => {
      const index = count - 1;
      this.entitySearchEditBtn(index).click();
      cy.wait(250);
      this.entitySearchEditNameBox().should('be.visible').clear().type(newName);
      cy.wait(250);
      this.editItemName(newItemName);
      cy.wait(250);
      this.entitySearchEditSaveBtn().click();
      cy.wait(250);
    });
  }

  public deleteItemFromList() {
    this.rowNum().then(count => {
      const index = count - 1;
      this.entitySearchEditBtn(index).click();
      cy.wait(250);
      this.entitySearchEditNameBox().should('be.visible');
      this.deleteItem();
      cy.wait(250);
      this.entitySearchEditSaveBtn().click();
      cy.wait(250);
    });
  }

  // Delete operations
  public deleteList() {
    cy.get('#entitySearchDeleteBtn').first().click();
    this.entitySearchDeleteDeleteBtn().click();
    cy.wait(500);
  }

  // Helper methods
  public editItemName(newItemName: string) {
    this.entitySearchItemEditBtn().click();
    this.entitySearchEditItemNameBox().clear().type(newItemName);
    cy.wait(250);
    this.entitySearchEditItemSaveBtn().click();
  }

  public deleteItem() {
    this.entitySearchItemDeleteBtn().click();
  }

  public cleanup() {
    cy.get('#entitySearchDeleteBtn').first().then($btn => {
      if ($btn.length > 0) {
        cy.wrap($btn).click();
        this.entitySearchDeleteDeleteBtn().click();
        // Note: Tests should intercept DELETE API calls if they need to wait
      }
    });
  }

  // DEPRECATED: Use API intercepts in tests instead
  public waitForSpinnerHide() {
    cy.log('WARNING: waitForSpinnerHide is deprecated - use API intercepts instead');
  }
}

const searchableListsPage = new SearchableListsPage();
export default searchableListsPage;
