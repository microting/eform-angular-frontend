import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import workOrdersPage from '../../../Page objects/WorkOrders.page';

const expect = require('chai').expect;

describe('Work Orders Page',function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToOrdersPage();
    $('#workOrderId').waitForDisplayed({timeout: 20000});
  });
  it('Read Work Orders', function () {
    const rowNum = workOrdersPage.rowNum;
    expect(rowNum).to.be.equal(2);
  });
  it('Search Work Orders', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    const searchString = 'hhhh';
    $('#searchInput').setValue(searchString);
    browser.pause(500);
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    const rowNum = workOrdersPage.rowNum;
    expect(rowNum).to.be.equal(1);
  });
  it('Sort Work Orders by Id', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    $('#createdAtHeader').click();
    $('#idTableHeader').click();
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('1');
  });
  it('Sort Work Orders by Created At', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    $('#createdAtHeader').click();
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('1');
  });
  it('Sort Work Orders by Description', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    $('#descriptionHeader').click();
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
  it('Sort Work Orders by Corrected at the Latest', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    $('#correctedAtTheLatestHeader').click();
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('1');
  });
  it('Sort Work Orders by Done At', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToOrdersPage();
    $('#doneAtHeader').click();
    $('#doneAtHeader').click();
    const id = workOrdersPage.firstWorkOrderId;
    expect(id).equal('2');
  });
});
