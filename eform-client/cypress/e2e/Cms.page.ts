import {Navbar} from './Navbar.page';

export class CmsPage {
  public Navbar = new Navbar();

  // ── Settings tab ──────────────────────────────────────────────────────────
  Settings = {
    getCmsEnabledToggle: () => cy.get('#cmsEnabledToggle'),
    getSaveBtn: () => cy.get('#cmsSettingsSaveBtn'),

    enable: () => {
      cy.intercept('GET', '**/api/cms/settings').as('getSettings');
      cy.intercept('PUT', '**/api/cms/settings').as('saveSettings');
      cy.get('#cmsEnabledToggle input[type="checkbox"]').then($cb => {
        if (!$cb.prop('checked')) {
          cy.get('#cmsEnabledToggle').click();
        }
      });
      cy.get('#cmsSettingsSaveBtn').should('be.visible').click();
      cy.wait('@saveSettings', {timeout: 30000});
    },

    disable: () => {
      cy.intercept('PUT', '**/api/cms/settings').as('saveSettings');
      cy.get('#cmsEnabledToggle input[type="checkbox"]').then($cb => {
        if ($cb.prop('checked')) {
          cy.get('#cmsEnabledToggle').click();
        }
      });
      cy.get('#cmsSettingsSaveBtn').should('be.visible').click();
      cy.wait('@saveSettings', {timeout: 30000});
    },
  };

  // ── Pages tab ─────────────────────────────────────────────────────────────
  Pages = {
    getNewPageBtn: () => cy.get('#cmsNewPageBtn'),
    getPageRows: () => cy.get('mat-row'),

    clickNewPage: () => {
      cy.intercept('GET', '**/api/cms/pages').as('getPages');
      cy.get('#cmsNewPageBtn').should('be.visible').click();
      cy.wait(500);
    },
  };

  // ── Page edit form ────────────────────────────────────────────────────────
  PageEdit = {
    getTitleInput: () => cy.get('#cmsPageTitle'),
    getIsLandingPageToggle: () => cy.get('#cmsPageIsLandingPage'),
    getIsPublishedToggle: () => cy.get('#cmsPageIsPublished'),
    getSaveBtn: () => cy.get('#cmsPageSaveBtn'),

    setTitle: (title: string) => {
      cy.get('#cmsPageTitle').should('be.visible').clear().type(title);
    },

    setBodyViaTinyMce: (content: string) => {
      // TinyMCE loads asynchronously in an iframe; wait for it then use the API
      cy.window().then(win => {
        cy.wrap(null).should(() => {
          expect((win as any).tinymce?.activeEditor).to.exist;
        });
        (win as any).tinymce.activeEditor.setContent(content);
      });
    },

    enableLandingPage: () => {
      cy.get('#cmsPageIsLandingPage input[type="checkbox"]').then($cb => {
        if (!$cb.prop('checked')) {
          cy.get('#cmsPageIsLandingPage').click();
        }
      });
    },

    enablePublished: () => {
      cy.get('#cmsPageIsPublished input[type="checkbox"]').then($cb => {
        if (!$cb.prop('checked')) {
          cy.get('#cmsPageIsPublished').click();
        }
      });
    },

    save: () => {
      cy.intercept({method: 'POST', url: '**/api/cms/pages'}).as('createPage');
      cy.intercept({method: 'PUT', url: '**/api/cms/pages/**'}).as('updatePage');
      cy.get('#cmsPageSaveBtn').should('be.visible').click();
      cy.wait(['@createPage', '@updatePage'], {timeout: 30000});
    },
  };

  // ── Public landing page ───────────────────────────────────────────────────
  Landing = {
    getBody: () => cy.get('#cmsPageBody'),
    waitForLoad: () => {
      cy.intercept('GET', '**/api/cms/public/landing').as('getLanding');
      cy.wait('@getLanding', {timeout: 30000});
    },
  };

  // ── Tab navigation ────────────────────────────────────────────────────────
  goToTab(label: 'Settings' | 'Pages' | 'Menus') {
    cy.get('#cmsTabGroup').contains('.mat-mdc-tab', label).click();
    cy.wait(300);
  }
}

const cmsPage = new CmsPage();
export default cmsPage;
