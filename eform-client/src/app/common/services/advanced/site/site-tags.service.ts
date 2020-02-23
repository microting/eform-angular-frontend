import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from '../../base.service';
import {SiteTagsUpdateModel} from '../../../models/advanced/site-tags-update.model';

const SitesMethods = {
  Tags: '/api/sites/tags',
  CreateTag: '/api/sites/tags/create',
  DeleteTag: '/api/sites/tags/delete',
  UpdateTags: '/api/sites/tags/update'
};

@Injectable()
export class SiteTagsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAvailableTags(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get(SitesMethods.Tags);
  }

  deleteTag(tagId: number): Observable<OperationResult> {
    return this.get(SitesMethods.DeleteTag + '?tagId=' + tagId);
  }

  createTag(tagName: string): Observable<OperationResult> {
    return this.post(SitesMethods.CreateTag + '?tagName=' + tagName, {});
  }

  updateSiteTags = (model: SiteTagsUpdateModel): Observable<OperationResult> => {
    return this.post(SitesMethods.UpdateTags, model);
  }
}
