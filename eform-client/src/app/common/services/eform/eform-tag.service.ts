import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SavedTagModel,
  TemplateTagsUpdateModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TemplateTagMethods = {
  Tags: 'api/tags',
  DeleteTag: 'api/tags/delete',
  TemplateTags: 'api/tags/template',
  SavedTags: 'api/tags/saved',
};

@Injectable()
export class EformTagService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAvailableTags(): Observable<
    OperationDataResult<Array<CommonDictionaryModel>>
  > {
    return this.apiBaseService.get(TemplateTagMethods.Tags);
  }

  getSavedTags(): Observable<OperationDataResult<any>> {
    return this.apiBaseService.get(TemplateTagMethods.SavedTags);
  }

  addSavedTag(model: SavedTagModel): Observable<OperationResult> {
    return this.apiBaseService.put(TemplateTagMethods.SavedTags, model);
  }

  deleteSavedTag(tagId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TemplateTagMethods.SavedTags + '?tagId=' + tagId
    );
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.apiBaseService.get(
      TemplateTagMethods.DeleteTag + '?tagId=' + tagId
    );
  }

  createTag(tagName: string): Observable<OperationResult> {
    return this.apiBaseService.post(
      TemplateTagMethods.Tags + '?tagName=' + tagName,
      {}
    );
  }

  updateTemplateTags = (
    model: TemplateTagsUpdateModel
  ): Observable<OperationResult> => {
    return this.apiBaseService.post(TemplateTagMethods.TemplateTags, model);
  };
}
