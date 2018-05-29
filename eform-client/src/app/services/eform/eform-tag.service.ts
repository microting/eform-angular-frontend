import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {OperationDataResult} from '../../modules/helpers/helpers.module';
import {BaseService} from '../base.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

import {TemplateTagMethods} from 'app/modules/helpers/app.constants';
import {CommonDictionaryModel, TemplateTagsUpdateModel} from 'app/models';
import {OperationResult} from 'app/modules/helpers/operation.models';

@Injectable()
export class EformTagService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAvailableTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.getWithOperationResult(TemplateTagMethods.Tags);
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.getWithOperationResult(TemplateTagMethods.DeleteTag + '?tagId=' + tagId);
  }

  createTag(tagName: string): Observable<OperationResult> {
    return this.postModelOperationResult(TemplateTagMethods.Tags + '?tagName=' + tagName, {});
  }

  updateTemplateTags = (model: TemplateTagsUpdateModel): Observable<OperationResult> => {
    return this.postModelOperationResult(TemplateTagMethods.TemplateTags, model);
  }
}
