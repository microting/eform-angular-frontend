import Page from '../Page';

export class OuterInnerResourceModalPage extends Page {
  constructor() {
    super();
  }

  public async outerResourceCreateNameInput() {
    const ele = await $('#createOuterResourceName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async outerResourceCreateSaveBtn() {
    const ele = await $('#outerResourceCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async outerResourceCreateCancelBtn() {
    const ele = await $('#outerResourceCreateCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async outerResourceEditNameInput() {
    const ele = await $('#updateOuterResourceName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async outerResourceEditSaveBtn() {
    const ele = $('#outerResourceEditSaveBtn');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async outerResourceEditCancelBtn() {
    const ele = await $('#outerResourceEditCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  // public async outerResourceDeleteAreaId() {
  //   const ele = $('#selectedOuterResourceId');
  //   ele.waitForDisplayed({timeout: 20000});
  //   ele.waitForClickable({timeout: 20000});
  //   return ele;
  // }

  // public async outerResourceDeleteAreaName() {
  //   const ele = $('#selectedOuterResourceName');
  //   ele.waitForDisplayed({timeout: 20000});
  //   ele.waitForClickable({timeout: 20000});
  //   return ele;
  // }

  public async outerResourceDeleteDeleteBtn() {
    const ele = await $('#outerResourceDeleteDeleteBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async outerResourceDeleteCancelBtn() {
    const ele = await $('#outerResourceDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceCreateNameInput() {
    const ele = await $('#createInnerResourceName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceCreateSaveBtn() {
    const ele = await $('#innerResourceCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async innerResourceCreateCancelBtn() {
    const ele = await $('#innerResourceCreateCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceEditName() {
    const ele = await $('#updateInnerResourceName');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceEditSaveBtn() {
    const ele = await $('#innerResourceEditSaveBtn');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async innerResourceEditCancelBtn() {
    const ele = await $('#innerResourceEditCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  // public async innerResourceDeleteName() {
  //   const ele = $('#innerResourceDeleteName');
  //   ele.waitForDisplayed({timeout: 20000});
  //   ele.waitForClickable({timeout: 20000});
  //   return ele;
  // }

  public async innerResourceDeleteDeleteBtn() {
    const ele = await $('#innerResourceDeleteDeleteBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceDeleteCancelBtn() {
    const ele = await $('#innerResourceDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async innerResourceEditExternalIdInput() {
    const ele = await $('#updateInnerResourceExternalId');
    await ele.waitForDisplayed({timeout: 20000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async createInnerResourceId() {
    const ele = await $('#createInnerResourceId');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async createOuterResourceExternalId() {
    const ele = await $('#createOuterResourceExternalId');
    await ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public async outerResourceEditExternalIdInput() {
    // const ele = $('#createOuterResourceExternalId');
    // ele.waitForDisplayed({timeout: 20000});
    // return ele;
    return this.createOuterResourceExternalId();
  }
}

const outerInnerResourceModalPage = new OuterInnerResourceModalPage();
export default outerInnerResourceModalPage;
