import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

export class Workers extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public firstNameBox(): Locator {
    return this.page.locator('#firstName');
  }

  public lastNameBox(): Locator {
    return this.page.locator('#lastName');
  }

  public firstNameEditBox(): Locator {
    return this.page.locator('#firstNameEdit');
  }

  public lastNameEditBox(): Locator {
    return this.page.locator('#lastNameEdit');
  }

  public workerCreateBtn(): Locator {
    return this.page.locator('#workerCreateBtn');
  }

  public workerSaveBtn(): Locator {
    return this.page.locator('#workerSaveBtn');
  }

  public workerEditBtn(): Locator {
    return this.page.locator('#workerEditBtn');
  }

  public workerEditSaveBtn(): Locator {
    return this.page.locator('#workerEditSaveBtn');
  }

  public workerSelect(): Locator {
    return this.page.locator('#workerSelector');
  }

  public firstElement(): Locator {
    return this.page.locator(`//*[contains(@class, 'custom')]//*[contains(text(), 'Gurkemine Ralphine')]`);
  }

  public async rowNum(): Promise<number> {
    return await this.page.locator('#tableBody > tr').count();
  }

  getWorker(num: number): WorkersRowObject {
    return new WorkersRowObject(this.page, num);
  }

  public async createNewWorker(firstName: string, lastName: string) {
    await this.workerCreateBtn().click();
    await this.page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    await this.workerSelect().click();
    await this.page.waitForTimeout(1000);
    await this.firstElement().click();
    await this.firstNameBox().pressSequentially(firstName);
    await this.lastNameBox().pressSequentially(lastName);
    await this.page.waitForTimeout(1000);
    await this.workerSaveBtn().click();
  }

  public async editWorker(worker: WorkersRowObject, firstName: string, lastName: string) {
    await worker.openRowMenu();
    const index = worker.index - 1;
    const editBtn = this.page.locator(`#workerEditBtn${index}`);
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();
    await this.page.locator('#firstNameEdit').waitFor({ state: 'visible', timeout: 8000 });
    await this.firstNameEditBox().clear();
    await this.firstNameEditBox().pressSequentially(firstName);
    await this.page.waitForTimeout(2000);
    await this.lastNameEditBox().clear();
    await this.lastNameEditBox().pressSequentially(lastName);
    await this.page.waitForTimeout(2000);
    await this.workerEditSaveBtn().click();
  }
}

export class WorkersRowObject {
  constructor(page: Page, rowNumber: number) {
    this.page = page;
    this.index = rowNumber + 1;
    // Note: these will need to be populated asynchronously in Playwright
    // The sync constructor pattern from WDIO doesn't translate directly
  }

  page: Page;
  index: number;
  siteId: number;
  firstName: string;
  lastName: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async init(): Promise<WorkersRowObject> {
    const rowNumber = this.index - 1;
    this.siteId = +(await this.page.locator('#workerUID').nth(this.index).textContent() || '0');
    this.firstName = await this.page.locator('#workerFirstName').nth(this.index).textContent() || '';
    this.lastName = await this.page.locator('#workerLastName').nth(this.index).textContent() || '';
    this.editBtn = this.page.locator('#workerEditBtn').nth(this.index);
    this.deleteBtn = this.page.locator('#workerDeleteBtn').nth(this.index);
    return this;
  }

  async openRowMenu() {
    const index = this.index - 1;
    const menuBtn = this.page.locator(`#action-items-${index} #actionMenu`);
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }
}
