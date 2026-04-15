import loginPage from '../../../Login.page';
import pluginPage from '../../../Plugin.page';

describe('Enable Backend Config plugin', () => {
  beforeEach(() => {
    cy.task('log', '[Folder b - Settings] ========== BeforeEach: Setting up test ==========');
    cy.task('log', '[Folder b - Settings] Visiting homepage and logging in');
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.task('log', '[Folder b - Settings] Navigating to plugins page');
    pluginPage.Navbar.goToPluginsPage();
    cy.task('log', '[Folder b - Settings] BeforeEach setup complete');
  });

  it('should validate default Time registration plugin settings', () => {
    cy.task('log', '[Folder b - Settings] ========== Test: Validate default Time registration plugin settings ==========');
    cy.task('log', '[Folder b - Settings] Clicking action menu');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.task('log', '[Folder b - Settings] Setting up intercept for settings-get');
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder b - Settings] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder b - Settings] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder b - Settings] Settings loaded successfully');

    cy.task('log', '[Folder b - Settings] Verifying googleSheetId input field');
    const googleSheetIdInputField = cy.get('.flex-cards.mt-3 mat-form-field');
    googleSheetIdInputField
      .should('have.length', 1)
      .scrollIntoView().should('be.visible');
    googleSheetIdInputField
      .should('have.attr', 'class')
      .and('not.include', 'mat-form-field-disabled');

    cy.task('log', '[Folder b - Settings] Verifying disabled input fields (should be 22)');
    const disabledInputFields = cy.get('.flex-cards.mt-4 mat-form-field');
    disabledInputFields
      .should('have.length', 22);
    disabledInputFields
      .should('have.attr', 'class')
      .and('include', 'mat-form-field-disabled');


    const dayBreakMinutesDividerValues = [
      '03:00',
      '03:00',
      '03:00',
      '03:00',
      '03:00',
      '02:00',
      '02:00'
    ];
    const dayBreakMinutesPrDividerValues = [
      '00:30',
      '00:30',
      '00:30',
      '00:30',
      '00:30',
      '00:30',
      '00:30'
    ];
    const dayBreakMinutesUpperLimitValues = [
      '01:00',
      '01:00',
      '01:00',
      '01:00',
      '01:00',
      '01:00',
      '01:00'
    ];

    cy.task('log', '[Folder b - Settings] Starting loop to verify break minutes fields for all days of week');
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach((day, index) => {
      cy.task('log', `[Folder b - Settings] Verifying ${day} break settings`);
      const breakMinutesDividerFieldId = `${day}BreakMinutesDivider`;
      let breakMinutesDividerInputField = cy.get(`#${breakMinutesDividerFieldId}`);
      breakMinutesDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesDividerInputField
        .should('have.attr', 'disabled');

      breakMinutesDividerInputField = cy.get(`#${breakMinutesDividerFieldId}`);
      breakMinutesDividerInputField
        .should('include.value', dayBreakMinutesDividerValues[index]);

      const breakMinutesPrDividerFieldId = `${day}BreakMinutesPrDivider`;
      let breakMinutesPrDividerInputField = cy.get(`#${breakMinutesPrDividerFieldId}`);
      breakMinutesPrDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesPrDividerInputField
        .should('have.attr', 'disabled');

      breakMinutesPrDividerInputField = cy.get(`#${breakMinutesPrDividerFieldId}`);
      breakMinutesPrDividerInputField
        .should('include.value', dayBreakMinutesPrDividerValues[index]);

      const breakMinutesUpperLimitFieldId = `${day}BreakMinutesUpperLimit`;
      let breakMinutesUpperLimitInputField = cy.get(`#${breakMinutesUpperLimitFieldId}`);
      breakMinutesUpperLimitInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesUpperLimitInputField
        .should('have.attr', 'disabled');

      breakMinutesUpperLimitInputField = cy.get(`#${breakMinutesUpperLimitFieldId}`);
      breakMinutesUpperLimitInputField
        .should('include.value', dayBreakMinutesUpperLimitValues[index]);
    });

    cy.task('log', '[Folder b - Settings] Verifying autoBreakCalculationActiveToggle');
    let autoBreakCalculationToggle = cy.get('#autoBreakCalculationActiveToggle');
    autoBreakCalculationToggle
      .scrollIntoView().should('be.visible')
      .should('not.be.checked');
    cy.task('log', '[Folder b - Settings] Clicking autoBreakCalculationActiveToggle');
    autoBreakCalculationToggle.click();
    autoBreakCalculationToggle = cy.get('#autoBreakCalculationActiveToggle div button');
    autoBreakCalculationToggle
      .should('have.attr', 'aria-checked', 'true');

    cy.task('log', '[Folder b - Settings] Verifying enabled input fields');
    const enabledInputFields = cy.get('.flex-cards.mt-4 mat-form-field');
    enabledInputFields
      .should('have.length', 22)
      .should('be.visible');
    enabledInputFields
      .should('have.attr', 'class')
      .and('not.include', 'mat-form-field-disabled');
    cy.task('log', '[Folder b - Settings] Test completed successfully');
  });

  it('should activate auto calculation break times', () => {
    cy.task('log', '[Folder b - Settings] ========== Test: Activate auto calculation break times ==========');
    cy.task('log', '[Folder b - Settings] Clicking action menu');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.task('log', '[Folder b - Settings] Setting up intercept for settings-get');
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder b - Settings] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder b - Settings] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder b - Settings] Settings loaded successfully');

    const googleSheetIdInputField = cy.get('.flex-cards.mt-3 mat-form-field');
    googleSheetIdInputField
      .should('have.length', 1)
      .scrollIntoView().should('be.visible');
    googleSheetIdInputField
      .should('have.attr', 'class')
      .and('not.include', 'mat-form-field-disabled');

    const disabledInputFields = cy.get('.flex-cards.mt-4 mat-form-field');
    disabledInputFields
      .should('have.length', 22)
      .should('be.visible');
    disabledInputFields
      .should('have.attr', 'class')
      .and('include', 'mat-form-field-disabled');


    const newDayBreakMinutesDividerValues = [
      '04:30',
      '05:45',
      '06:45',
      '07:40',
      '08:45',
      '09:50',
      '10:45'
    ];
    const newDayBreakMinutesPrDividerValues = [
      '01:30',
      '02:35',
      '03:40',
      '04:45',
      '05:50',
      '06:55',
      '07:30'
    ];
    const newDayBreakMinutesUpperLimitValues = [
      '02:05',
      '03:10',
      '04:15',
      '05:20',
      '06:25',
      '07:35',
      '08:40'
    ];

    cy.task('log', '[Folder b - Settings] Clicking autoBreakCalculationActiveToggle');
    let autoBreakCalculationToggle = cy.get('#autoBreakCalculationActiveToggle');
    autoBreakCalculationToggle
      .scrollIntoView().should('be.visible')
      .should('not.be.checked');
    autoBreakCalculationToggle.click();
    autoBreakCalculationToggle = cy.get('#autoBreakCalculationActiveToggle div button');
    cy.task('log', '[Folder b - Settings] Verifying toggle is ON');
    autoBreakCalculationToggle
      .should('have.attr', 'aria-checked', 'true');

    cy.task('log', '[Folder b - Settings] Verifying input fields are enabled');
    const enabledInputFields = cy.get('.flex-cards.mt-4 mat-form-field');
    enabledInputFields
      .should('have.length', 22)
      .should('be.visible');
    enabledInputFields
      .should('have.attr', 'class')
      .and('not.include', 'mat-form-field-disabled');
    cy.task('log', '[Folder b - Settings] Starting loop to set new break times for all days');
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    daysOfWeek.forEach((day, index) => {
      cy.task('log', `[Folder b - Settings] Setting ${day} break times`);
      // set new values for break minutes divider
      const breakMinutesDividerFieldId = `${day}BreakMinutesDivider`;
      let breakMinutesDividerInputField = cy.get(`#${breakMinutesDividerFieldId}`);
      breakMinutesDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesDividerInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');

      /* ==== Generated with Cypress Studio ==== */
      cy.get(`#${breakMinutesDividerFieldId}`).click();
      // eslint-disable-next-line max-len
      let degrees = 360 / 12 * parseInt(newDayBreakMinutesDividerValues[index].split(':')[0]);
      let minuteDegrees = 360 / 60 * parseInt(newDayBreakMinutesDividerValues[index].split(':')[1]);
      cy.get('[style="transform: rotateZ(' + degrees + 'deg) translateX(-50%);"] > span').click();
      if (minuteDegrees > 0) {
        cy.wait(1000);
        cy.get('[style="transform: rotateZ(' + minuteDegrees + 'deg) translateX(-50%);"] > span').click({force: true});
      }
      cy.get('.timepicker-button span').contains('Ok').click();

      const breakMinutesPrDividerFieldId = `${day}BreakMinutesPrDivider`;
      let breakMinutesPrDividerInputField = cy.get(`#${breakMinutesPrDividerFieldId}`);
      breakMinutesPrDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesPrDividerInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');

      /* ==== Generated with Cypress Studio ==== */
      cy.get(`#${breakMinutesPrDividerFieldId}`).click();
      // eslint-disable-next-line max-len
      degrees = 360 / 12 * parseInt(newDayBreakMinutesPrDividerValues[index].split(':')[0]);
      minuteDegrees = 360 / 60 * parseInt(newDayBreakMinutesPrDividerValues[index].split(':')[1]);
      cy.get('[style="transform: rotateZ(' + degrees + 'deg) translateX(-50%);"] > span').click();
      if (minuteDegrees > 0) {
        cy.get('[style="transform: rotateZ(' + minuteDegrees + 'deg) translateX(-50%);"] > span').click({force: true});
      }
      cy.get('.timepicker-button span').contains('Ok').click();

      const breakMinutesUpperLimitFieldId = `${day}BreakMinutesUpperLimit`;
          let breakMinutesUpperLimitInputField = cy.get(`#${breakMinutesUpperLimitFieldId}`);
      breakMinutesUpperLimitInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesUpperLimitInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');


      cy.get(`#${breakMinutesUpperLimitFieldId}`).click();
      // eslint-disable-next-line max-len
      degrees = 360 / 12 * parseInt(newDayBreakMinutesUpperLimitValues[index].split(':')[0]);
      minuteDegrees = 360 / 60 * parseInt(newDayBreakMinutesUpperLimitValues[index].split(':')[1]);
      cy.get('[style="transform: rotateZ(' + degrees + 'deg) translateX(-50%);"] > span').click();
      if (minuteDegrees > 0) {
        cy.get('[style="transform: rotateZ(' + minuteDegrees + 'deg) translateX(-50%);"] > span').click({force: true});
      }
      cy.get('.timepicker-button span').contains('Ok').click();
      //     breakMinutesUpperLimitInputField
      //       .should('have.length', 1)
      //       .should('be.visible');
      //     breakMinutesUpperLimitInputField
      //       .should('have.attr', 'disabled');

    });
    cy.task('log', '[Folder b - Settings] Setting up intercept for updateSettings');
    cy.intercept('PUT', '/api/time-planning-pn/settings').as('updateSettings');
    cy.task('log', '[Folder b - Settings] Clicking saveSettings button');
    cy.get('#saveSettings').click();
    cy.task('log', '[Folder b - Settings] Waiting for updateSettings API call');
    cy.wait('@updateSettings').then((interception) => {
      cy.task('log', `[Folder b - Settings] Update settings response: ${interception.response.statusCode}`);
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.task('log', '[Folder b - Settings] Navigating to homepage');
    cy.visit('http://localhost:4200');
    cy.task('log', '[Folder b - Settings] Navigating to plugins page');
    pluginPage.Navbar.goToPluginsPage();

    cy.task('log', '[Folder b - Settings] Clicking action menu to verify settings');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.task('log', '[Folder b - Settings] Setting up intercept for settings-get');
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder b - Settings] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder b - Settings] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder b - Settings] Settings loaded successfully');

    // const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    cy.task('log', '[Folder b - Settings] Starting loop to verify saved break times');
    daysOfWeek.forEach((day, index) => {
      cy.task('log', `[Folder b - Settings] Verifying saved ${day} break times`);
      const breakMinutesDividerFieldId = `${day}BreakMinutesDivider`;
      let breakMinutesDividerInputField = cy.get(`#${breakMinutesDividerFieldId}`);
      breakMinutesDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesDividerInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');

      breakMinutesDividerInputField = cy.get(`#${breakMinutesDividerFieldId}`);
      breakMinutesDividerInputField
        .should('include.value', newDayBreakMinutesDividerValues[index]);

      const breakMinutesPrDividerFieldId = `${day}BreakMinutesPrDivider`;
      let breakMinutesPrDividerInputField = cy.get(`#${breakMinutesPrDividerFieldId}`);
      breakMinutesPrDividerInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesPrDividerInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');

      breakMinutesPrDividerInputField = cy.get(`#${breakMinutesPrDividerFieldId}`);
      breakMinutesPrDividerInputField
        .should('include.value', newDayBreakMinutesPrDividerValues[index]);

      const breakMinutesUpperLimitFieldId = `${day}BreakMinutesUpperLimit`;
      let breakMinutesUpperLimitInputField = cy.get(`#${breakMinutesUpperLimitFieldId}`);
      breakMinutesUpperLimitInputField
        .should('have.length', 1)
        .scrollIntoView().should('be.visible');
      breakMinutesUpperLimitInputField
        .should('have.attr', 'class')
        .and('not.include', 'mat-form-field-disabled');

      breakMinutesUpperLimitInputField = cy.get(`#${breakMinutesUpperLimitFieldId}`);
      breakMinutesUpperLimitInputField
        .should('include.value', newDayBreakMinutesUpperLimitValues[index]);
    });

    /* ==== End Cypress Studio ==== */
    cy.task('log', '[Folder b - Settings] Test completed successfully');
  });

  it('should toggle GPS and Snapshot settings and persist changes', () => {
    cy.task('log', '[Folder b - Settings] ========== Test: Toggle GPS and Snapshot settings ==========');
    // Navigate to settings page
    cy.task('log', '[Folder b - Settings] Clicking action menu');
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.task('log', '[Folder b - Settings] Setting up intercept for settings-get');
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get');
    cy.task('log', '[Folder b - Settings] Clicking plugin settings link');
    cy.get('#plugin-settings-link0').click();
    cy.task('log', '[Folder b - Settings] Waiting for settings-get API call');
    cy.wait('@settings-get', { timeout: 60000 });
    cy.task('log', '[Folder b - Settings] Settings loaded successfully');

    // Test GPS toggle - turn ON
    cy.task('log', '[Folder b - Settings] Testing GPS toggle - turning ON');
    let gpsToggle = cy.get('#gpsEnabledToggle');
    // gpsToggle
    //   .should('be.visible')
    //   .should('not.be.checked');
    cy.task('log', '[Folder b - Settings] Clicking GPS toggle');
    gpsToggle.click();

    let gpsToggleButton = cy.get('#gpsEnabledToggle div button');
    cy.task('log', '[Folder b - Settings] Verifying GPS toggle is ON');
    gpsToggleButton
      .should('have.attr', 'aria-checked', 'true');

    // Save settings
    cy.task('log', '[Folder b - Settings] Saving GPS settings (ON)');
    cy.intercept('PUT', '/api/time-planning-pn/settings').as('updateSettings');
    cy.get('#saveSettings').click();
    cy.wait('@updateSettings').then((interception) => {
      cy.task('log', `[Folder b - Settings] GPS settings saved: ${interception.response.statusCode}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    // Reload page and verify GPS is still ON
    cy.task('log', '[Folder b - Settings] Reloading page to verify GPS persistence');
    cy.visit('http://localhost:4200');
    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get-2');
    cy.get('#plugin-settings-link0').click();
    cy.wait('@settings-get-2', { timeout: 60000 });

    cy.task('log', '[Folder b - Settings] Verifying GPS is still ON after reload');
    gpsToggleButton = cy.get('#gpsEnabledToggle div button');
    gpsToggleButton
      .should('have.attr', 'aria-checked', 'true');

    // Test GPS toggle - turn OFF
    cy.task('log', '[Folder b - Settings] Testing GPS toggle - turning OFF');
    let snapshotToggle = cy.get('#snapshotEnabledToggle');
    // snapshotToggle
    //   .should('be.visible')
    //   .should('not.be.checked');
    gpsToggle = cy.get('#gpsEnabledToggle');
    cy.task('log', '[Folder b - Settings] Clicking GPS toggle to turn OFF');
    gpsToggle.click();

    gpsToggleButton = cy.get('#gpsEnabledToggle div button');
    gpsToggleButton
      .should('have.attr', 'aria-checked', 'false');

    // Save settings
    cy.intercept('PUT', '/api/time-planning-pn/settings').as('updateSettings-2');
    cy.get('#saveSettings').click();
    cy.wait('@updateSettings-2').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // Reload page and verify GPS is still OFF
    cy.visit('http://localhost:4200');
    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get-3');
    cy.get('#plugin-settings-link0').click();
    cy.wait('@settings-get-3', { timeout: 60000 });

    cy.task('log', '[Folder b - Settings] Verifying GPS is still OFF after reload');
    gpsToggleButton = cy.get('#gpsEnabledToggle div button');
    gpsToggleButton
      .should('have.attr', 'aria-checked', 'false');

    // Test Snapshot toggle - turn ON
    cy.task('log', '[Folder b - Settings] Testing Snapshot toggle - turning ON');
    cy.task('log', '[Folder b - Settings] Clicking Snapshot toggle');
    snapshotToggle.click();

    let snapshotToggleButton = cy.get('#snapshotEnabledToggle div button');
    cy.task('log', '[Folder b - Settings] Verifying Snapshot toggle is ON');
    snapshotToggleButton
      .should('have.attr', 'aria-checked', 'true');

    // Save settings
    cy.task('log', '[Folder b - Settings] Saving Snapshot settings (ON)');
    cy.intercept('PUT', '/api/time-planning-pn/settings').as('updateSettings-3');
    cy.get('#saveSettings').click();
    cy.wait('@updateSettings-3').then((interception) => {
      cy.task('log', `[Folder b - Settings] Snapshot settings saved: ${interception.response.statusCode}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    // Reload page and verify Snapshot is still ON
    cy.task('log', '[Folder b - Settings] Reloading page to verify Snapshot persistence');
    cy.visit('http://localhost:4200');
    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get-4');
    cy.get('#plugin-settings-link0').click();
    cy.wait('@settings-get-4', { timeout: 60000 });

    cy.task('log', '[Folder b - Settings] Verifying Snapshot is still ON after reload');
    snapshotToggleButton = cy.get('#snapshotEnabledToggle div button');
    snapshotToggleButton
      .should('have.attr', 'aria-checked', 'true');

    // Test Snapshot toggle - turn OFF
    cy.task('log', '[Folder b - Settings] Testing Snapshot toggle - turning OFF');
    snapshotToggle = cy.get('#snapshotEnabledToggle');
    cy.task('log', '[Folder b - Settings] Clicking Snapshot toggle to turn OFF');
    snapshotToggle.click();

    snapshotToggleButton = cy.get('#snapshotEnabledToggle div button');
    cy.task('log', '[Folder b - Settings] Verifying Snapshot toggle is OFF');
    snapshotToggleButton
      .should('have.attr', 'aria-checked', 'false');

    // Save settings
    cy.task('log', '[Folder b - Settings] Saving Snapshot settings (OFF)');
    cy.intercept('PUT', '/api/time-planning-pn/settings').as('updateSettings-4');
    cy.get('#saveSettings').click();
    cy.wait('@updateSettings-4').then((interception) => {
      cy.task('log', `[Folder b - Settings] Snapshot settings saved: ${interception.response.statusCode}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    // Reload page and verify Snapshot is still OFF
    cy.task('log', '[Folder b - Settings] Reloading page to verify Snapshot is still OFF');
    cy.visit('http://localhost:4200');
    pluginPage.Navbar.goToPluginsPage();
    cy.get('#actionMenu')
      .scrollIntoView().should('be.visible')
      .click({ force: true });
    cy.intercept('GET', '**/api/time-planning-pn/settings').as('settings-get-5');
    cy.get('#plugin-settings-link0').click();
    cy.wait('@settings-get-5', { timeout: 60000 });

    cy.task('log', '[Folder b - Settings] Verifying Snapshot is still OFF after final reload');
    snapshotToggleButton = cy.get('#snapshotEnabledToggle div button');
    snapshotToggleButton
      .should('have.attr', 'aria-checked', 'false');
    cy.task('log', '[Folder b - Settings] Test completed successfully');
  });

  // afterEach(() => {
  //   cy.visit('http://localhost:4200');
  //   pluginPage.Navbar.goToPluginsPage();
  //   const pluginName = 'Microting Time Planning Plugin';
  //   // pluginPage.enablePluginByName(pluginName);
  //   let row = cy.contains('.mat-mdc-row', pluginName).first();
  //   // row = cy.contains('.mat-mdc-row', pluginName).first();
  //   let settingsElement = row
  //     .find('.mat-column-actions a');
  //     // .should('be.enabled')
  //     // .should('be.visible');
  //   settingsElement.click();
  //   const resetGlobalAutoBreakCalculationSettingsButton = cy.get('#resetGlobalAutoBreakCalculationSettings');
  //   resetGlobalAutoBreakCalculationSettingsButton
  //     .should('be.visible')
  //     .should('be.enabled');
  //   resetGlobalAutoBreakCalculationSettingsButton.click();
  // });
});
