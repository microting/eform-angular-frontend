import loginPage from '../Login.page';
import searchableListsPage from '../SearchableLists.page';

describe('Searchable Lists - Add', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    searchableListsPage.goToEntitySearchPage();
    searchableListsPage.createEntitySearchBtn().should('be.visible', { timeout: 40000 });
  });

  it('should create a new searchable list with no items', () => {
    const name = `Test-${Date.now()}`;
    
    searchableListsPage.rowNum().then(initialCount => {
      searchableListsPage.createSearchableList_NoItem(name);
      
      searchableListsPage.getFirstRowObject().then(searchableList => {
        expect(searchableList.name).to.equal(name);
      });
      
      searchableListsPage.cleanup();
    });
  });

  it('should not create a new searchable list when cancelled', () => {
    const name = `Test-${Date.now()}`;
    
    searchableListsPage.rowNum().then(initialCount => {
      searchableListsPage.createSearchableList_NoItem_Cancels(name);
      
      searchableListsPage.rowNum().should('equal', initialCount);
    });
  });

  it('should create a new searchable list with one item', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    searchableListsPage.createSearchableList_OneItem(name, itemName);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
      
      // Verify the item was created
      searchableList.editBtn.click();
      cy.wait(500);
      searchableListsPage.firstEntityItemName().should('contain.text', itemName);
      searchableListsPage.entitySearchEditCancelBtn().click();
      
      searchableListsPage.cleanup();
    });
  });

  it('should not create a new searchable list with one item when cancelled', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    
    searchableListsPage.rowNum().then(initialCount => {
      searchableListsPage.createSearchableList_OneItem_Cancels(name, itemName);
      
      searchableListsPage.rowNum().should('equal', initialCount);
    });
  });

  it('should create a new searchable list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    
    searchableListsPage.createSearchableList_MultipleItems(name, itemNames);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
      
      // Verify items were created
      searchableList.editBtn.click();
      cy.wait(500);
      
      // Verify first item and delete items one by one
      searchableListsPage.firstEntityItemName().should('contain.text', 'a');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'b');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'c');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'd');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'e');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      
      searchableListsPage.entitySearchEditCancelBtn().click();
      
      searchableListsPage.cleanup();
    });
  });

  it('should not create a searchable list with multiple items when cancelled', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    
    searchableListsPage.rowNum().then(initialCount => {
      searchableListsPage.createSearchableList_MultipleItems_Cancels(name, itemNames);
      
      searchableListsPage.rowNum().should('equal', initialCount);
    });
  });
});
