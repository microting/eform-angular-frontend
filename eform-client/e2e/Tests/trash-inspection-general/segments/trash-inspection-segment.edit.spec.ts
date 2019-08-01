import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import segmentPage from '../../../Page objects/trash-inspection/TrashInspection-Segment.page';
import {Guid} from 'guid-typescript';

describe('Trash Inspection Plugin - Segment', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('Should edit segment.', function () {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const description = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    const newSDKFolderId = Math.floor((Math.random() * 20) + 1);
    segmentPage.goToSegmentsPage();
    segmentPage.createSegment(name, description, sdkFolderId);
    segmentPage.editSegment(newName, newDescription, newSDKFolderId);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.description).equal(newDescription);
    expect(segment.sdkFolderId).equal(`${newSDKFolderId}`);
    segmentPage.deleteSegment();
  });
  it('Should edit segment with only Name.', function () {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    segmentPage.createSegment(name);
    segmentPage.editSegment(newName);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    segmentPage.deleteSegment();
  });
  it('Should edit segment with name and description.', function () {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const description = Guid.create().toString();
    const newDescription = Guid.create().toString();
    segmentPage.createSegment(name, description);
    segmentPage.editSegment(newName, newDescription);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.description).equal(newDescription);
    segmentPage.deleteSegment();
  });
  it('Should edit segment with name and sdkFolderId.', function () {
    const name = Guid.create().toString();
    const newName = Guid.create().toString();
    const sdkFolderId = Math.floor((Math.random() * 10) + 1);
    const newSDKFolderId = Math.floor((Math.random() * 10) + 1);
    segmentPage.createSegment(name, '', sdkFolderId);
    segmentPage.editSegment(newName, '', newSDKFolderId);
    const segment = segmentPage.getFirstRowObject();
    expect(segment.name).equal(newName);
    expect(segment.sdkFolderId).equal(`${newSDKFolderId}`);
    segmentPage.deleteSegment();
  });
});
