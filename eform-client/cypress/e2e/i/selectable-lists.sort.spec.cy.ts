import loginPage from '../Login.page';
import selectableListsPage from '../SelectableLists.page';
import { testSorting, generateRandmString } from '../helper-functions';

describe('Selectable Lists - Sort', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    selectableListsPage.goToEntitySelectPage();
    selectableListsPage.entitySelectCreateBtn().should('be.visible', { timeout: 40000 });
    
    // Create dummy selectable lists for sorting tests
    for (let i = 0; i < 3; i++) {
      selectableListsPage.createSelectableList_NoItem(
        generateRandmString(),
        generateRandmString()
      );
    }
  });

  it('should be able to sort by ID', () => {
    testSorting(
      () => selectableListsPage.idTableHeader(),
      'td.id',
      'ID'
    );
  });

  it('should be able to sort by Name', () => {
    testSorting(
      () => selectableListsPage.nameTableHeader(),
      'td.name',
      'Name'
    );
  });

  it('should be able to sort by Description', () => {
    testSorting(
      () => selectableListsPage.descriptionTableHeader(),
      'td.description',
      'Description'
    );
  });

  after(() => {
    // Cleanup all created lists
    selectableListsPage.rowNum().then(count => {
      // Delete all lists except 'Device users' if it exists
      for (let i = 0; i < count; i++) {
        selectableListsPage.getFirstRowObject().then(row => {
          if (row.name !== 'Device users') {
            selectableListsPage.deleteList();
            cy.wait(500);
          }
        });
      }
    });
  });
});
