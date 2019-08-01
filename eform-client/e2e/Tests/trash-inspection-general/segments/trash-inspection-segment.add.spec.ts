import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {Guid} from 'guid-typescript';

describe('Trash Inspection Plugin - Segment', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should create segment.', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    segmentPage.goToSegmentsPage();
    segmentPage.createSegment(name, description, sdkFolderId);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);
    segmentPage.deleteSegment();
  });
  it('Should create segment with only Name.', function () {
    const name = Guid.create().toString();
    segmentPage.createSegment(name);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    segmentPage.deleteSegment();
  });
  it('Should create segment with name and description.', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    segmentPage.createSegment(name, description);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.description).equal(description);
    segmentPage.deleteSegment();
  });
  it('Should create segment with name and sdkFolderId.', function () {
    const name = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    segmentPage.createSegment(name, '', sdkFolderId);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(name);
    expect(segment.sdkFolderId).equal(`${sdkFolderId}`);
    segmentPage.deleteSegment();
  });
});
