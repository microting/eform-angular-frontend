import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SavedTagModel,
  SharedTagCreateModel,
  SharedTagModel,
  TemplateTagsUpdateModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TemplateTagMethods = {
  Tags: 'api/tags',
  TagIndex: 'api/tags/index',
  TemplateTags: 'api/tags/template',
  SavedTags: 'api/tags/saved',
};

@Injectable()
export class EformTagService {
  private apiBaseService = inject(ApiBaseService);


  getAvailableTags(): Observable<
    OperationDataResult<Array<CommonDictionaryModel>>
  > {
    return this.apiBaseService.get(TemplateTagMethods.TagIndex);
  }

  getSavedTags(): Observable<OperationDataResult<{ tagList:{tagId: number, tagName: string}[] }>> {
    return this.apiBaseService.get(TemplateTagMethods.SavedTags);
  }

  addSavedTag(model: SavedTagModel): Observable<OperationResult> {
    return this.apiBaseService.put(TemplateTagMethods.SavedTags, model);
  }

  deleteSavedTag(tagId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(TemplateTagMethods.SavedTags, {
      tagId: tagId,
    });
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(TemplateTagMethods.Tags, {
      tagId: tagId,
    });
  }

  createTag(tag: SharedTagCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(TemplateTagMethods.Tags, tag);
  }

  updateTemplateTags(
    model: TemplateTagsUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(TemplateTagMethods.TemplateTags, model);
  }

  updateTag(tag: SharedTagModel): Observable<OperationResult> {
    return this.apiBaseService.put(TemplateTagMethods.Tags, tag);
  }
}
