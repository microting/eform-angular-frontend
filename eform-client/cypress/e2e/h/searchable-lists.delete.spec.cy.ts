import loginPage from '../Login.page';
import searchableListsPage from '../SearchableLists.page';

describe('Searchable Lists - Delete', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    searchableListsPage.goToEntitySearchPage();
    searchableListsPage.createEntitySearchBtn().should('be.visible', { timeout: 40000 });
  });

  it('should delete a list with only name', () => {
    const name = `Test-${Date.now()}`;
    
    // Create a list
    searchableListsPage.createSearchableList_NoItem(name);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
    });
    
    // Delete the list
    searchableListsPage.rowNum().then(currentRowNum => {
      searchableListsPage.deleteList();
      cy.wait(1000);
      
      searchableListsPage.rowNum().should('equal', currentRowNum - 1);
    });
  });

  it('should delete item from list', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    // Create a list with one item
    searchableListsPage.createSearchableList_OneItem(name, itemName);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
      
      searchableList.editBtn.click();
      cy.wait(500);
      searchableListsPage.firstEntityItemName().should('contain.text', itemName);
      searchableListsPage.entitySearchEditCancelBtn().click();
    });
    
    // Delete the item from list
    searchableListsPage.deleteItemFromList();
    
    // Verify item was deleted
    searchableListsPage.entitySearchEditBtn().click();
    searchableListsPage.entitySearchEditNameBox().should('be.visible', { timeout: 40000 });
    searchableListsPage.items().should('equal', 0);
    searchableListsPage.entitySearchEditCancelBtn().click();
    
    searchableListsPage.cleanup();
  });

  it('should delete a list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    
    // Create a list with multiple items
    searchableListsPage.createSearchableList_MultipleItems(name, itemNames);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
    });
    
    // Delete the list
    searchableListsPage.rowNum().then(currentRowNum => {
      searchableListsPage.deleteList();
      cy.wait(1000);
      
      searchableListsPage.rowNum().should('equal', currentRowNum - 1);
    });
  });
});
