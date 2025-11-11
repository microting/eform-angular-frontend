import loginPage from '../Login.page';
import {generateRandmString, getRandomInt, selectValueInNgSelectorNoSelector} from '../helper-functions';
import { Navbar } from '../Navbar.page';
import { myEformsPage } from '../MyEforms.page';

const navbar = new Navbar();

describe('Visual editor - Create eForm', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
  });

  it('should not create visual template without any translations on main checklist', () => {
    const fieldName = generateRandmString();

    // Try to create field without main checklist name (translation)
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Save button should be disabled without main checklist translation
    cy.get('#saveCreateEformBtn').should('be.disabled');
  });

  it('should create visual template without any fields', () => {
    const eformName = generateRandmString();
    const eformDescription = generateRandmString();

    // Set main checklist name and description
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').clear().type(eformDescription);

    // Save the eForm without adding any fields
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list
    cy.get('#mainPageEFormsTableBody').should('be.visible');
    cy.get('#mainPageEFormsTableBody tbody tr').first().find('#eform-label-0').eq(0).should('contain', eformName);

    // Verify eForm has correct properties when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').should('contain', eformDescription);

    // No fields should be present
    cy.get('#fields_0').should('not.exist');
  });

  it('should create visual template', () => {
    const eformName = generateRandmString();
    const eformDescription = generateRandmString();
    const fieldName = generateRandmString();
    const fieldDescription = generateRandmString();

    // Set main checklist name and description
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').clear().type(eformDescription);

    // Add a field (Info element/None type)
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#fieldDescriptionTranslation_0').clear().type(fieldDescription);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list
    cy.get('#mainPageEFormsTableBody').should('be.visible');
    cy.get('#mainPageEFormsTableBody tbody tr').first().find('#eform-label-0').eq(0).should('contain', eformName);

    // Verify eForm has correct properties when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').should('contain', eformDescription);

    // Verify field exists with correct properties
    cy.get('#fieldSection0').should('exist');
    cy.get('#fieldSection0').should('contain', fieldName);
  });

  it('should create visual template with one pdfField', () => {
    const eformName = generateRandmString();
    const eformDescription = generateRandmString();
    const fieldName = generateRandmString();
    const fieldDescription = generateRandmString();

    // Set main checklist name and description
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').clear().type(eformDescription);

    // Add a PDF field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('pdf');
    selectValueInNgSelectorNoSelector('PDF');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#fieldDescriptionTranslation_0').clear().type(fieldDescription);

    // Upload PDF file
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/attachment-english.pdf', { force: true });
    cy.wait(1000);

    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list
    cy.get('#mainPageEFormsTableBody').should('be.visible');
    cy.get('#mainPageEFormsTableBody tbody tr').first().find('#eform-label-0').eq(0).should('contain', eformName);

    // Verify eForm has correct properties when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
    cy.get('#fieldSection0').should('contain', fieldName);
  });

  it('should create checklist with field non standard color', () => {
    const eformName = generateRandmString();
    const eformDescription = generateRandmString();
    const fieldName = generateRandmString();

    // Set main checklist name and description
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').clear().type(eformDescription);

    // Add a field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Change field color to red by clicking the red color button (5th button, index 4)
    cy.get('#fieldSection0 #colors button').eq(4).click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list
    cy.get('#mainPageEFormsTableBody').should('be.visible');
    cy.get('#mainPageEFormsTableBody tbody tr').first().find('#eform-label-0').eq(0).should('contain', eformName);

    // Verify field has red color when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#fieldSection0').should('exist');
    cy.get('#fieldSection0').should('contain', fieldName);
    // Verify color by checking the field has the red color class or styling
    // cy.get('#fieldSection0 .field-color-red').should('exist');
    // check the style attribyte for background-color to be background-color: rgb(255, 228, 228);
    cy.get('#fieldSection0 > div > div').should('have.attr', 'style').and('include', 'background-color: rgb(255, 228, 228)');
  });

  it('should create visual template with one numberField', () => {
    const eformName = generateRandmString();
    const eformDescription = generateRandmString();
    const fieldName = generateRandmString();
    const fieldDescription = generateRandmString();
    const minValue = getRandomInt(0, 100);
    const maxValue = getRandomInt(100, 200);
    const defaultValue = getRandomInt(0, 200);
    const decimalCount = 0;

    // Set main checklist name and description
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);
    cy.get('#mainCheckListDescriptionTranslation_1').clear().type(eformDescription);

    // Add a Number field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Num');
    selectValueInNgSelectorNoSelector('Numerisk');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#fieldDescriptionTranslation_0').clear().type(fieldDescription);

    // Set number field properties
    cy.get('#minValueEdit').clear().type(minValue.toString());
    cy.get('#maxValueEdit').clear().type(maxValue.toString());
    cy.get('#defaultValueEdit').clear().type(defaultValue.toString());
    cy.get('#decimalCountEdit').clear().type(decimalCount.toString());

    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list
    cy.get('#mainPageEFormsTableBody').should('be.visible');
    cy.get('#mainPageEFormsTableBody tbody tr').first().find('#eform-label-0').eq(0).should('contain', eformName);

    // Verify eForm has correct properties when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
    cy.get('#fieldSection0').should('contain', fieldName);
  });

  it('should create visual template with one field and make copy this field', () => {
    const eformName = generateRandmString();
    const fieldName = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add a field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Make a copy of the field
    cy.get('#fieldSection0 #copyBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm appears in the list

    // Verify eForm has two fields when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#fieldSection0').should('exist').should('contain', fieldName);
    cy.get('#fieldSection1').should('exist').should('contain', fieldName);
  });

  it('should create visual template with one fieldGroup and one nested field with change color and make copy from nested field', () => {
    const eformName = generateRandmString();
    const fieldGroupName = generateRandmString();
    const nestedFieldName = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add a field group
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('grup');
    selectValueInNgSelectorNoSelector('Gruppe');
    cy.get('#fieldNameTranslation_0').clear().type(fieldGroupName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Expand the field group
    cy.get('#fieldSection0 #collapseToggleBtn').click();
    cy.wait(500);

    // Add nested field
    cy.get('#fieldSection0 #addNewNestedField').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(nestedFieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Change nested field color to red by clicking the red color button (5th button, index 4)
    cy.get('#fields_0 #fieldSection0 #colors button').eq(4).click();
    cy.wait(1000);

    // Make a copy of the nested field
    cy.get('#fields_0 #fieldSection0 #copyBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm has correct structure when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    // Verify field group exists
    cy.get('#fieldSection0').should('contain', fieldGroupName);

    // Verify both nested fields exist with red color
    cy.get('#fields_0 #fieldSection0').should('contain', nestedFieldName);
    cy.get('#fields_0 #fieldSection1').should('contain', nestedFieldName);
    cy.get('#fieldSection0 > div > div').should('have.attr', 'style').and('include', 'background-color: rgb(255, 228, 228)');
    cy.get('#fieldSection1 > div > div').should('have.attr', 'style').and('include', 'background-color: rgb(255, 228, 228)');
  });

  it('should create visual template and delete field', () => {
    const eformName = generateRandmString();
    const fieldGroupName = generateRandmString();
    const nestedFieldName = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add a field group
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('grup');
    selectValueInNgSelectorNoSelector('Gruppe');
    cy.get('#fieldNameTranslation_0').clear().type(fieldGroupName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Expand the field group
    cy.get('#fieldSection0 #collapseToggleBtn').click();
    cy.wait(500);

    // Add nested field
    cy.get('#fieldSection0 #addNewNestedField').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(nestedFieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Change nested field color to red by clicking the red color button (5th button, index 4)
    cy.get('#fields_0 #fieldSection0 #colors button').eq(4).click();
    cy.wait(1000);

    // Make a copy of the nested field
    cy.get('#fields_0 #fieldSection0 #copyBtn').click();
    cy.wait(1000);

    // Delete the field group
    cy.get('#fieldSection0 #deleteBtn').click();
    cy.get('#fieldDeleteDeleteBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify field group is deleted when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    // No fields should exist
    cy.get('#fields_0').should('not.exist');
  });

  it('should create visual template with one nested checklist and without fields', () => {
    const eformName = generateRandmString();
    const nestedChecklist1Name = generateRandmString();
    const nestedChecklist2Name = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add first nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist1Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Add second nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist2Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm has nested checklists when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
  });

  it('should create visual template with one nested checklist and with some fields', () => {
    const eformName = generateRandmString();
    const nestedChecklist1Name = generateRandmString();
    const nestedChecklist2Name = generateRandmString();
    const fieldName = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add first nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist1Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Add field to first nested checklist
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Add second nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist2Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm structure when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
  });

  it('should create visual template with one nested checklist and with pdfField', () => {
    const eformName = generateRandmString();
    const nestedChecklist1Name = generateRandmString();
    const nestedChecklist2Name = generateRandmString();
    const fieldName = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add first nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist1Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Add PDF field to first nested checklist
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('pdf');
    selectValueInNgSelectorNoSelector('PDF');
    cy.get('#fieldNameTranslation_0').clear().type(fieldName);

    // Upload PDF file
    cy.get('input[type="file"]').first().selectFile('cypress/fixtures/attachment-english.pdf', { force: true });
    cy.wait(1000);

    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Add second nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklist2Name);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify eForm structure when edited
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
  });

  it('should create visual template and change order field (not nested)', () => {
    const eformName = generateRandmString();
    const field1Name = generateRandmString();
    const field2Name = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add first field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(field1Name);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Add second field
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(field2Name);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    cy.get('#fieldSection0') // draggable
      .trigger('mousedown', { button: 0, bubbles: true })
      .trigger('mousemove', { pageX: 10, pageY: 0 });

    cy.get('#fieldSection1') // droppable

      .trigger('mousemove', { position: 'center' })
      .trigger('mouseup', { button: 0, bubbles: true });
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify field order when edited
    // cy.get('#spinner-animation').should('not.exist');
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    // Field 2 should now be first
    cy.get('#fieldSection0').should('contain', field2Name);
    cy.get('#fieldSection1').should('contain', field1Name);
  });

  it('should create visual template and change order nested field', () => {
    const eformName = generateRandmString();
    const nestedChecklistName = generateRandmString();
    const field1Name = generateRandmString();
    const field2Name = generateRandmString();

    // Set main checklist name
    cy.get('#mainCheckListNameTranslation_1').clear().type(eformName);

    // Add nested checklist
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type(nestedChecklistName);
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(1000);

    // Add first field to nested checklist
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(field1Name);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Add second field to nested checklist
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('Info');
    selectValueInNgSelectorNoSelector('Info');
    cy.get('#fieldNameTranslation_0').clear().type(field2Name);
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(1000);

    // Change nested field order using drag and drop
    cy.get('#fieldSection1') // draggable
      .trigger('mousedown', { button: 0, bubbles: true })
      .trigger('mousemove', { pageX: 10, pageY: 0 });

    cy.get('#fieldSection0') // droppable
      .trigger('mousemove', { position: 'center' })
      .trigger('mouseup', { button: 0, bubbles: true });
    cy.wait(1000);

    // Save the eForm
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    cy.wait('@getTags', { timeout: 60000 });

    // Verify nested field order when edited
    // cy.get('#spinner-animation').should('not.exist');
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
  });

  it('should correct read created eform from xml', () => {
    const eformName = generateRandmString();

    // Create eForm from XML first (navigate to My eForms)
    cy.get('#cancelEditBtn').click();
    cy.wait(500);

    // Create eForm using XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
      <Main>
        <Id>138798</Id>
        <Repeated>0</Repeated>
        <Label>${eformName}</Label>
        <StartDate>2017-08-04</StartDate>
        <EndDate>2027-08-04</EndDate>
        <Language>da</Language>
        <MultiApproval>false</MultiApproval>
        <FastNavigation>false</FastNavigation>
        <Review>false</Review>
        <Summary>false</Summary>
        <DisplayOrder>0</DisplayOrder>
        <ElementList>
          <Element type="DataElement">
            <Id>138798</Id>
            <Label>Number 2</Label>
            <Description><![CDATA[]]></Description>
            <DisplayOrder>0</DisplayOrder>
            <ReviewEnabled>false</ReviewEnabled>
            <ManualSync>false</ManualSync>
            <ExtraFieldsEnabled>false</ExtraFieldsEnabled>
            <DoneButtonDisabled>false</DoneButtonDisabled>
            <ApprovalEnabled>false</ApprovalEnabled>
            <DataItemList>
              <DataItem type="Number">
                <Id>343948</Id>
                <Label>Number 2</Label>
                <Description><![CDATA[]]></Description>
                <DisplayOrder>0</DisplayOrder>
                <MinValue/>
                <MaxValue/>
                <Value/>
                <DecimalCount/>
                <UnitName/>
                <Mandatory>true</Mandatory>
                <ReadOnly>false</ReadOnly>
              </DataItem>
            </DataItemList>
          </Element>
        </ElementList>
      </Main>`;

    cy.get('#newEFormBtn').click();
    cy.get('#createEformBtn').should('be.visible').click();

    // Enter XML
    cy.get('#eFormXMLTextarea').clear().type(xmlContent.replace(/\n\s+/g, ''), { parseSpecialCharSequences: false, delay: 0 });
    cy.get('#eFormLabelInput').clear().type(eformName);

    cy.intercept('POST', '**/api/templates').as('createTemplate');
    cy.get('#eFormSaveBtn').click();
    cy.wait('@createTemplate', { timeout: 60000 });

    // Open in visual editor
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });

    // Verify eForm created from XML has correct properties
    cy.get('#mainCheckListNameTranslation_1').should('have.value', eformName);
    cy.get('#fieldSection0').should('contain', 'Number 2');
  });

  afterEach(() => {
    // Clean up - delete created eForm
    navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
