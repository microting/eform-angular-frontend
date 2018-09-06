import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';

describe('My eforms', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should create eform without any tags', function () {
  });
  it('should create eform simultaneously with creating 1 tag', function () {

  });
  it('should create eform simultaneously with creating 2 and more tags', function () {

  });
  it('should create eform with creating 1 tag and using 1 already prepared tag', function () {

  });
  it('should create eform while adding 1 already prepared tag', function () {

  });
  it('should create eform while adding more than 2 already prepared tags', function () {

  });
  it('should not create eform if xml is empty', function () {

  });

});
