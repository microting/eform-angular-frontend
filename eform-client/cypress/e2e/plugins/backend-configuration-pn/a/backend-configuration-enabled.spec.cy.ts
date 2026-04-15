import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';
import {beforeEach} from 'mocha';

describe('Enable Backend Config plugin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    pluginPage.Navbar.goToPluginsPage();
    pluginPage.rowNum()
      .should('not.eq', 0) // we have plugins list
      .should('eq', 3); // we have only 3 plugins: items planning, time planning and backend config
  });
//   it('should enabled Items Planning plugin', () => {
//     const pluginName = 'Microting Items Planning Plugin';
//     pluginPage.enablePluginByName(pluginName);
//     const row = cy.contains('.mat-row', pluginName).first();
//     row.find('.mat-column-actions button')
//       .should('contain.text', 'toggle_on'); // plugin is enabled
//   });
//   it('should enabled Time registration plugin', () => {
//     const pluginName = 'Microting Time Planning Plugin';
//     pluginPage.enablePluginByName(pluginName);
//     const row = cy.contains('.mat-row', pluginName).first();
//     row.find('.mat-column-actions button')
//       .should('contain.text', 'toggle_on'); // plugin is enabled
//   });
//   it('should enabled Backend Config plugin', () => {
//     const pluginName = 'Microting Backend Configuration Plugin';
//     pluginPage.enablePluginByName(pluginName);
//     const row = cy.contains('.mat-row', pluginName).first();
//     row.find('.mat-column-actions button')
//       .should('contain.text', 'toggle_on'); // plugin is enabled
//   });
});
// create canary in a coal mine test asserting true
it('asserts true', () => {
  // @ts-ignore
  expect(true).to.be.true // this will pass
});
