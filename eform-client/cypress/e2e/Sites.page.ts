import PageWithNavbarPage from './PageWithNavbar.page';
import tagsModalPage from './TagsModal.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum(): Promise<number> {
    return ($$('tbody > tr')).length;
  }

  public siteTagSelector(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#tagSelector').should('be.visible');
  }

  public siteTagRemovalListOfOptions(): Cypress.Chainable<JQuery<HTMLElement>> {
    return $$(`#tagForRemoval .ng-option`);
  }

  public updateTagsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#saveTagsBtn').should('be.visible');
  }

  public tagRemovalSelector(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#tagForRemoval').should('be.visible');
  }

  public removeTagBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#removeTagBtn').should('be.visible').should('be.enabled');
  }

  public sitesManageTagsBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#sitesManageTagsBtn').should('be.visible').should('be.enabled');
  }


  public asyncFirstAvailableTag(): Promise<Cypress.Chainable<JQuery>> {
    cy.get('#tagSelector').click();
    return $('.ng-option:not(.ng-option-selected)');
  }

  public cancelCreateBtn(): Promise<Cypress.Chainable<JQuery>> {
    return cy.get('#cancelCreateBtn');
  }

  public siteEditCancelBtn(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#siteEditCancelBtn');
    ele.should('be.visible').should('be.enabled');
    return ele;
  }

  public siteNameEditInput(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#siteName');
    ele.should('be.visible');
    return ele;
  }

  public tagSelector(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#tagSelector');
    ele.should('be.visible');
    return ele;
  }

  public siteEditSaveBtn(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#siteEditSaveBtn');
    ele.should('be.visible');
    return ele;
  }

  public siteDeleteCancelBtn(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#siteDeleteCancelBtn');
    ele.should('be.visible').should('be.enabled');
    return ele;
  }

  public siteDeleteDeleteBtn(): Promise<Cypress.Chainable<JQuery>> {
    const ele = cy.get('#siteDeleteDeleteBtn');
    ele.should('be.visible');
    return ele;
  }

  public createTag(tagName: string[]) {
    (this.sitesManageTagsBtn()).click();
    cy.wait(500);
    (tagsModalPage.tagsModalCloseBtn()).should('be.visible');
    for (let i = 0; i < tagName.length; i++) {
      tagsModalPage.createTag(tagName[i]);
    }
    tagsModalPage.closeTagModal();
    (this.sitesManageTagsBtn()).should('be.enabled').click();
  }

  public removeTags(tagName: string[]) {
    (this.sitesManageTagsBtn()).click();
    cy.wait(500);
    (tagsModalPage.tagsModalCloseBtn()).should('be.visible');
    for (let i = 0; i < tagName.length; i++) {
      (tagsModalPage.getTagByName(tagName[i])).deleteTag();
    }
    tagsModalPage.closeTagModal();
    (this.sitesManageTagsBtn()).should('be.enabled').click();
  }

  getSite(num): Promise<SitesRowObject> {
    cy.wait(500);
    const obj = new SitesRowObject();
    return obj.getRow(num);
  }

  getFirstRowObject(): Promise<SitesRowObject> {
    cy.wait(500);
    const rowNum = this.rowNum();
    if (rowNum > 1) {
      return this.getSite(2);
    } else {
      return this.getSite(1);
    }
  }
}

const sitesPage = new SitesPage();
export default sitesPage;

export class SitesRowObject {
  constructor() {}

  index: number;
  element: Cypress.Chainable<JQuery<HTMLElement>>;
  siteId: number;
  units: string;
  siteName: string;
  tags: string[];
  editBtn: Cypress.Chainable<JQuery<HTMLElement>>;
  deleteBtn: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum): Promise<SitesRowObject> {
    this.index = rowNum;
    this.element = cy.get('tbody > tr').eq(rowNum - 1);
    if (this.element) {
      this.siteId = +(this.element.find('#siteUUId').invoke('text'));
      this.units = (this.element.find('#units')).invoke('text');
      this.siteName = (this.element.find('#siteName')).invoke('text');
      const list = (this.element.find('mat-chip-list mat-chip span')).toArray();
      this.tags = list.map((el: HTMLElement) => el.innerText);
      this.editBtn = this.element.find('#editSiteBtn');
      this.deleteBtn = this.element.find('#deleteSiteBtn');
    }
    return this;
  }

  openRowMenu() {
    const index = this.index - 1;
    cy.get(`#action-items-${index} #actionMenu`).should('be.visible').click();
    cy.wait(200);
  }

  closeEditModal(clickCancel = false) {
    if (clickCancel) {
      sitesPage.siteEditCancelBtn().click();
    } else {
      sitesPage.siteEditSaveBtn().click();
    }
    cy.wait(500);
    sitesPage.sitesManageTagsBtn().should('be.visible', { timeout: 40000 });
  }

  openEditModal(site?: { name?: string; tags?: string[] }) {
    const index = this.index - 1;
    this.openRowMenu();
    cy.get(`#editSiteBtn${index}`).should('be.visible').click();
    cy.wait(500);
    sitesPage.siteEditCancelBtn().should('be.visible', {timeout: 40000});
    if (site) {
      if (site.name) {
        sitesPage.siteNameEditInput().clear();
        sitesPage.siteNameEditInput().type(site.name);
        cy.wait(500);
      }
      if (site.tags) {
        for (let i = 0; i < site.tags.length; i++) {
          sitesPage.tagSelector().find('input').type(site.tags[i]);
          cy.wait(500);
          cy.get('body').type('{enter}');
        }
      }
    }
  }

  edit(site?: { name?: string; tags?: string[] }, clickCancel = false) {
    this.openEditModal(site);
    this.closeEditModal(clickCancel);
  }

  openDeleteModal() {
    const index = this.index - 1;
    this.openRowMenu();
    cy.get(`#deleteSiteBtn${index}`).should('be.visible').click();
    cy.wait(500);
    sitesPage.siteDeleteCancelBtn().should('be.visible', {timeout: 40000}).click();
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      sitesPage.siteDeleteCancelBtn().click();
    } else {
      sitesPage.siteDeleteDeleteBtn().click();
    }
    cy.wait(500);
    sitesPage.sitesManageTagsBtn().should('be.visible', {timeout: 40000}).click();
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }
}
