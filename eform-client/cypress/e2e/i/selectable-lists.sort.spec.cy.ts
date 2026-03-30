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
    cy.get('body').then($body => {
      const deleteButtons = $body.find('button.entitySelectDeleteBtn');
      const count = deleteButtons.length;
      if (count === 0) return;

      // Chain deletions sequentially
      const deleteNext = (remaining: number) => {
        if (remaining <= 0) return;
        cy.get('body').then($b => {
          if ($b.find('button.entitySelectDeleteBtn').length > 0) {
            selectableListsPage.getFirstRowObject().then(row => {
              if (row.name !== 'Device users') {
                selectableListsPage.deleteList();
                cy.wait(500).then(() => deleteNext(remaining - 1));
              } else {
                deleteNext(remaining - 1);
              }
            });
          }
        });
      };
      deleteNext(count);
    });
  });
});
