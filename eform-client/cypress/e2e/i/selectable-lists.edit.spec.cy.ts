import loginPage from '../Login.page';
import selectableListsPage from '../SelectableLists.page';

describe('Selectable Lists - Edit', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    selectableListsPage.goToEntitySelectPage();
    selectableListsPage.entitySelectCreateBtn().should('be.visible', { timeout: 40000 });
  });

  it('should edit a selectable list with only name', () => {
    const name = `Test-${Date.now()}`;
    const newName = `NewName-${Date.now()}`;
    
    // Create a list
    selectableListsPage.createSelectableList_NoItem(name);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
    });
    
    // Edit the list name
    selectableListsPage.editSelectableListNameOnly(newName);
    cy.wait(1500);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(newName);
    });
    
    selectableListsPage.cleanup();
  });

  it('should edit list with name and one item', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    const newName = `NewName-${Date.now()}`;
    const newItemName = `NewItem-${Date.now()}`;
    
    // Create a list with one item
    selectableListsPage.createSelectableList_OneItem(name, itemName);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', itemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    // Edit both name and item
    selectableListsPage.editSelectableListNameAndItem(newName, newItemName);
    cy.wait(1500);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(newName);
      
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', newItemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    selectableListsPage.cleanup();
  });

  it('should edit only item name', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    const newItemName = `NewItem-${Date.now()}`;
    
    // Create a list with one item
    selectableListsPage.createSelectableList_OneItem(name, itemName);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', itemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    // Edit only the item name
    selectableListsPage.rowNum().then(count => {
      cy.get('button.entitySelectEditBtn').eq(count - 1).click();
      cy.wait(250);
      selectableListsPage.entitySelectEditName().should('be.visible');
      selectableListsPage.editItemName(newItemName);
      cy.wait(250);
      selectableListsPage.entitySelectEditSaveBtn().click();
      cy.wait(1500);
    });
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', newItemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    selectableListsPage.cleanup();
  });

  it('should edit a selectable list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a\n', 'b\n', 'c\n', 'd\n', 'e'];
    const newName = `NewName-${Date.now()}`;
    const newItemNames = 'f\ng\nh\ni\nj';
    
    // Create a list with multiple items
    selectableListsPage.createSelectableList_MultipleItems(name, itemNames);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
    });
    
    // Edit the list
    selectableListsPage.rowNum().then(rowNumber => {
      const index = rowNumber - 1;
      cy.get('button.entitySelectEditBtn').eq(index).click();
      cy.wait(500);
      
      selectableListsPage.entitySelectEditName().should('be.visible');
      selectableListsPage.entitySelectEditName().clear().type(newName);
      
      // Delete existing items
      for (let i = 0; i < 5; i++) {
        selectableListsPage.entityItemDeleteBtn().first().click();
        cy.wait(250);
      }
      
      // Import new items
      selectableListsPage.entitySelectEditImportListBtn().click();
      cy.wait(500);
      selectableListsPage.entitySelectImportTextArea().click().type(newItemNames);
      cy.wait(500);
      selectableListsPage.entitySelectImportSaveBtn().click();
      cy.wait(500);
      
      selectableListsPage.entitySelectEditSaveBtn().click();
      cy.wait(1500);
    });
    
    // Verify changes
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(newName);
      
      selectableList.editBtn.click();
      cy.wait(500);
      
      // Verify new items
      selectableListsPage.firstEntityItemName().should('contain.text', 'f');
      
      selectableListsPage.entitySelectEditCancelBtn().click();
    });
    
    selectableListsPage.cleanup();
  });
});
