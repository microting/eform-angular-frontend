import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult, SavedTagModel,
  TemplateTagsUpdateModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

export let TemplateTagMethods = {
  Tags: 'api/tags',
  DeleteTag: 'api/tags/delete',
  TemplateTags: 'api/tags/template',
  SavedTags: 'api/tags/saved'
};

@Injectable()
export class EFormTagService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAvailableTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(TemplateTagMethods.Tags);
  }

  getSavedTags(): Observable<OperationDataResult<any>> {
    return this.get(TemplateTagMethods.SavedTags);
  }

  addSavedTag(model: SavedTagModel): Observable<OperationResult> {
    return this.put(TemplateTagMethods.SavedTags, model);
  }

  deleteSavedTag(tagId: number): Observable<OperationResult> {
    return this.delete(TemplateTagMethods.SavedTags + '?tagId=' + tagId);
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.get(TemplateTagMethods.DeleteTag + '?tagId=' + tagId);
  }

  createTag(tagName: string): Observable<OperationResult> {
    return this.post(TemplateTagMethods.Tags + '?tagName=' + tagName, {});
  }

  updateTemplateTags = (model: TemplateTagsUpdateModel): Observable<OperationResult> => {
    return this.post(TemplateTagMethods.TemplateTags, model);
  }
}
