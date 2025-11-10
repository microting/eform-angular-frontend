import loginPage from '../Login.page';
import { Navbar } from '../Navbar.page';
import { myEformsPage } from '../MyEforms.page';

const navbar = new Navbar();


// @ts-ignore
describe('My eforms', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  // it('should edit xml', () => {
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('#newEFormBtn').click();
  //   cy.get('#eFormXml').click();
  //   cy.get('#eFormXml').type('<?xml version="1.0" encoding="UTF-8"?>\n' +
  //     '<Main>\n' +
  //     '  <Id>142747</Id>\n' +
  //     '  <Repeated>0</Repeated>\n' +
  //     '  <Label>checkbox</Label>\n' +
  //     '  <StartDate>2022-09-18</StartDate>\n' +
  //     '  <EndDate>2032-09-18</EndDate>\n' +
  //     '  <Language>da</Language>\n' +
  //     '  <MultiApproval>false</MultiApproval>\n' +
  //     '  <FastNavigation>false</FastNavigation>\n' +
  //     '  <Review>false</Review>\n' +
  //     '  <Summary>false</Summary>\n' +
  //     '  <DisplayOrder>0</DisplayOrder>\n' +
  //     '  <ElementList>\n' +
  //     '    <Element type="DataElement">\n' +
  //     '      <Id>142747</Id>\n' +
  //     '      <Label>checkbox</Label>\n' +
  //     '      <Description><![CDATA[]]></Description>\n' +
  //     '      <DisplayOrder>0</DisplayOrder>\n' +
  //     '      <ReviewEnabled>false</ReviewEnabled>\n' +
  //     '      <ManualSync>false</ManualSync>\n' +
  //     '      <ExtraFieldsEnabled>false</ExtraFieldsEnabled>\n' +
  //     '      <DoneButtonDisabled>false</DoneButtonDisabled>\n' +
  //     '      <ApprovalEnabled>false</ApprovalEnabled>\n' +
  //     '      <DataItemList>\n' +
  //     '        <DataItem type="CheckBox">\n' +
  //     '          <Id>376654</Id>\n' +
  //     '          <Label>Godkendt</Label>\n' +
  //     '          <Description><![CDATA[]]></Description>\n' +
  //     '          <DisplayOrder>0</DisplayOrder>\n' +
  //     '          <Selected>false</Selected>\n' +
  //     '          <Mandatory>false</Mandatory>\n' +
  //     '          <Color>e8eaf6</Color>\n' +
  //     '        </DataItem>\n' +
  //     '      </DataItemList>\n' +
  //     '    </Element>\n' +
  //     '  </ElementList>\n' +
  //     '</Main>');
  //   cy.intercept('POST', '**/api/templates/create').as('createeForm');
  //   cy.get('#createEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@createeForm', { timeout: 60000 });
  //   //cy.get('.mat-sort-header-content > .ng-tns-c153-6').click();
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#languageCheckbox1 > .mat-checkbox-layout').click();
  //   cy.get('#languageCheckbox1-input').check();
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_1').clear('C');
  //   cy.get('#mainCheckListNameTranslation_1').type('CheckBox');
  //   cy.wait(2000);
  //   cy.get('#editBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait(2000);
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_1').clear('C');
  //   cy.get('#fieldNameTranslation_1').type('CheckBox eng');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });

  afterEach(() => {
    // Clean up - delete created eForm
    navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
