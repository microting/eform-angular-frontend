import loginPage from '../Login.page';
import selectableListsPage from '../SelectableLists.page';

describe('Selectable Lists - Delete', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    selectableListsPage.goToEntitySelectPage();
    selectableListsPage.entitySelectCreateBtn().should('be.visible', { timeout: 40000 });
  });

  it('should delete a list with only name', () => {
    const name = `Test-${Date.now()}`;
    
    // Create a list
    selectableListsPage.createSelectableList_NoItem(name);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
    });
    
    // Delete the list
    selectableListsPage.rowNum().then(currentRowNum => {
      selectableListsPage.deleteList();
      cy.wait(1000);
      
      selectableListsPage.rowNum().should('equal', currentRowNum - 1);
    });
  });

  it('should not delete selectable list when cancelled', () => {
    const name = `Test-${Date.now()}`;
    
    // Create a list
    selectableListsPage.createSelectableList_NoItem(name);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
    });
    
    // Try to delete but cancel
    selectableListsPage.rowNum().then(currentRowNum => {
      cy.get('button.entitySelectDeleteBtn').first().click();
      selectableListsPage.entitySelectDeleteCancelBtn().click();
      cy.wait(500);
      
      selectableListsPage.rowNum().should('equal', currentRowNum);
    });
    
    selectableListsPage.cleanup();
  });

  it('should delete item from list', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    // Create a list with one item
    selectableListsPage.createSelectableList_OneItem(name, itemName);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', itemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    // Delete the item from list
    selectableListsPage.deleteItemFromList();
    
    // Verify item was deleted
    cy.get('button.entitySelectEditBtn').first().click();
    selectableListsPage.entitySelectEditName().should('be.visible', { timeout: 40000 });
    selectableListsPage.itemsEditPageCount().should('equal', 0);
    selectableListsPage.entitySelectEditCancelBtn().click();
    
    selectableListsPage.cleanup();
  });

  it('should delete a list with one item', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    // Create a list with one item
    selectableListsPage.createSelectableList_OneItem(name, itemName);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      // Verify the item exists
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', itemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    // Delete the list
    selectableListsPage.rowNum().then(currentRowNum => {
      selectableListsPage.deleteList();
      cy.wait(1000);
      
      selectableListsPage.rowNum().should('equal', currentRowNum - 1);
    });
  });

  it('should delete a list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a\n', 'b\n', 'c\n', 'd\n', 'e'];
    
    // Create a list with multiple items
    selectableListsPage.createSelectableList_MultipleItems(name, itemNames);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
    });
    
    // Delete the list
    selectableListsPage.rowNum().then(currentRowNum => {
      selectableListsPage.deleteList();
      cy.wait(1000);
      
      selectableListsPage.rowNum().should('equal', currentRowNum - 1);
    });
  });
});
