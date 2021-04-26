import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { SiteTagsUpdateModel } from '../../../models/advanced/site-tags-update.model';
import { ApiBaseService } from 'src/app/common/services';

const SitesMethods = {
  Tags: '/api/sites/tags',
  CreateTag: '/api/sites/tags/create',
  DeleteTag: '/api/sites/tags/delete',
  UpdateTags: '/api/sites/tags/update',
};

@Injectable()
export class SiteTagsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAvailableTags(): Observable<
    OperationDataResult<Array<CommonDictionaryModel>>
  > {
    return this.apiBaseService.get(SitesMethods.Tags);
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.apiBaseService.get(SitesMethods.DeleteTag + '?tagId=' + tagId);
  }

  createTag(tagName: string): Observable<OperationResult> {
    return this.apiBaseService.post(
      SitesMethods.CreateTag + '?tagName=' + tagName,
      {}
    );
  }

  updateSiteTags = (
    model: SiteTagsUpdateModel
  ): Observable<OperationResult> => {
    return this.apiBaseService.post(SitesMethods.UpdateTags, model);
  };
}
