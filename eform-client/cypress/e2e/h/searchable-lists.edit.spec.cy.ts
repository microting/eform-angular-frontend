import loginPage from '../Login.page';
import searchableListsPage from '../SearchableLists.page';

describe('Searchable Lists - Edit', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    searchableListsPage.goToEntitySearchPage();
    searchableListsPage.createEntitySearchBtn().should('be.visible', { timeout: 40000 });
  });

  it('should edit a searchable list with only name', () => {
    const name = `Test-${Date.now()}`;
    const newName = 'New Name';
    
    // Create a list
    searchableListsPage.createSearchableList_NoItem(name);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
    });
    
    // Edit the list name
    searchableListsPage.editSearchableListNameOnly(newName);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(newName);
    });
    
    searchableListsPage.cleanup();
  });

  it('should edit list with name and one item', () => {
    const name = `Test-${Date.now()}`;
    const itemName = `Item-${Date.now()}`;
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    
    // Create a list with one item
    searchableListsPage.createSearchableList_OneItem(name, itemName);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
      
      searchableList.editBtn.click();
      cy.wait(500);
      searchableListsPage.firstEntityItemName().should('contain.text', itemName);
      searchableListsPage.entitySearchEditCancelBtn().click();
    });
    
    // Edit both name and item
    searchableListsPage.editSearchableListNameAndItem(newName, newItemName);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(newName);
      
      searchableList.editBtn.click();
      cy.wait(500);
      searchableListsPage.firstEntityItemName().should('contain.text', newItemName);
      searchableListsPage.entitySearchEditCancelBtn().click();
    });
    
    searchableListsPage.cleanup();
  });

  it('should edit a searchable list with multiple items', () => {
    const name = `Test-${Date.now()}`;
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    
    // Create a list with multiple items
    searchableListsPage.createSearchableList_MultipleItems(name, itemNames);
    
    searchableListsPage.getFirstRowObject().then(searchableList => {
      expect(searchableList.name).to.equal(name);
    });
    
    // Edit the list
    searchableListsPage.rowNum().then(rowNumber => {
      const index = rowNumber - 1;
      searchableListsPage.entitySearchEditBtn(index).click();
      cy.wait(500);
      
      searchableListsPage.entitySearchEditNameBox().should('be.visible');
      searchableListsPage.entitySearchEditNameBox().clear().type(newName);
      
      // Delete existing items
      for (let i = 0; i < 5; i++) {
        searchableListsPage.entitySearchItemDeleteBtn().click();
        cy.wait(500);
      }
      
      // Import new items
      searchableListsPage.entitySearchEditImportBtn().click();
      cy.wait(500);
      searchableListsPage.entitySearchEditImportItemTextArea().click().type(newItemNames);
      cy.wait(500);
      searchableListsPage.entitySearchEditImportItemSaveBtn().click();
      cy.wait(500);
      
      searchableListsPage.entitySearchEditSaveBtn().click();
      cy.wait(1500);
    });
    
    // Verify changes
    searchableListsPage.rowNum().then(rowNumber => {
      cy.get('tbody > tr').eq(rowNumber - 1).find('#entitySearchName').should('contain.text', newName);
      
      searchableListsPage.entitySearchEditBtn(rowNumber - 1).click();
      cy.wait(500);
      
      // Verify new items
      searchableListsPage.firstEntityItemName().should('contain.text', 'f');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      cy.wait(500);
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'g');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      cy.wait(500);
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'h');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      cy.wait(500);
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'i');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      cy.wait(500);
      
      searchableListsPage.firstEntityItemName().should('contain.text', 'j');
      searchableListsPage.entitySearchItemDeleteBtn().click();
      cy.wait(500);
      
      searchableListsPage.entitySearchEditCancelBtn().click();
      cy.wait(500);
    });
    
    searchableListsPage.cleanup();
  });
});
