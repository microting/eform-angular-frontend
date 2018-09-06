import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  TemplateTagsUpdateModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

export let TemplateTagMethods = {
  Tags: 'api/tags',
  DeleteTag: 'api/tags/delete',
  TemplateTags: 'api/tags/template'
};

@Injectable()
export class EFormTagService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAvailableTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(TemplateTagMethods.Tags);
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
