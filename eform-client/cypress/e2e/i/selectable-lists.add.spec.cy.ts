import loginPage from '../Login.page';
import selectableListsPage from '../SelectableLists.page';

describe('Selectable Lists - Add', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    selectableListsPage.goToEntitySelectPage();
    selectableListsPage.entitySelectCreateBtn().should('be.visible', { timeout: 40000 });
  });

  it('should create a new selectable list with no items', () => {
    const name = `Test-${Date.now()}`;
    const description = `Description-${Date.now()}`;
    
    selectableListsPage.rowNum().then(initialCount => {
      selectableListsPage.createSelectableList_NoItem(name, description);
      
      selectableListsPage.getLastRowObject().then(selectableList => {
        expect(selectableList.name).to.equal(name);
        expect(selectableList.description).to.equal(description);
      });
      
      selectableListsPage.cleanup();
    });
  });

  it('should not create a new selectable list when cancelled', () => {
    const name = `Test-${Date.now()}`;
    
    selectableListsPage.rowNum().then(initialCount => {
      selectableListsPage.createSelectableList_NoItem_Cancels(name);
      
      selectableListsPage.rowNum().should('equal', initialCount);
    });
  });

  it('should create a new selectable list with one item', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    selectableListsPage.createSelectableList_OneItem(name, itemName);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      // Verify the item was created
      selectableList.editBtn.click();
      cy.wait(500);
      selectableListsPage.firstEntityItemName().should('contain.text', itemName);
      selectableListsPage.entitySelectEditCancelBtn().click();
      
      selectableListsPage.cleanup();
    });
  });

  it('should not create a new selectable list with one item when cancelled', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    selectableListsPage.rowNum().then(initialCount => {
      selectableListsPage.createSelectableList_OneItem_Cancels(name, itemName);
      
      selectableListsPage.rowNum().should('equal', initialCount);
    });
  });

  it('should create a new selectable list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a\n', 'b\n', 'c\n', 'd\n', 'e'];
    
    selectableListsPage.createSelectableList_MultipleItems(name, itemNames);
    
    selectableListsPage.getLastRowObject().then(selectableList => {
      expect(selectableList.name).to.equal(name);
      
      // Verify items were created
      selectableList.editBtn.click();
      cy.wait(500);
      
      // Verify first item name
      selectableListsPage.firstEntityItemName().should('contain.text', 'a');
      
      selectableListsPage.entitySelectEditCancelBtn().click();
      
      selectableListsPage.cleanup();
    });
  });

  it('should not create a new selectable list with multiple items when cancelled', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a\n', 'b\n', 'c\n', 'd\n', 'e'];
    
    selectableListsPage.rowNum().then(initialCount => {
      selectableListsPage.createSelectableList_MultipleItems_Cancels(name, itemNames);
      
      selectableListsPage.rowNum().should('equal', initialCount);
    });
  });
});
