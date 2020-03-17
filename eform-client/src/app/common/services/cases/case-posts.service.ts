import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  CasePostCreateModel,
  CasePostsListModel,
  CasePostsRequest,
  CasePostViewModel,
  OperationDataResult,
  OperationResult
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const CasePostsMethods = {
  Main: '/api/cases/posts',
  View: '/api/cases/posts/view',
};

@Injectable()
export class CasePostsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllPosts(model: CasePostsRequest): Observable<OperationDataResult<CasePostsListModel>> {
    return this.get(CasePostsMethods.Main, model);
  }

  getPostForView(id: number): Observable<OperationDataResult<CasePostViewModel>> {
    return this.get<CasePostViewModel>(CasePostsMethods.View + '/' + id);
  }

  createPost(model: CasePostCreateModel): Observable<OperationResult> {
    return this.post(CasePostsMethods.Main, model);
  }
}
