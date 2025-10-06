import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CasePostCreateModel,
  CasePostsListModel,
  CasePostsRequestModel,
  CasePostViewModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const CasePostsMethods = {
  Main: '/api/cases/posts',
  View: '/api/cases/posts/view',
};

@Injectable()
export class CasePostsService {
  private apiBaseService = inject(ApiBaseService);


  getAllPosts(
    model: CasePostsRequestModel
  ): Observable<OperationDataResult<CasePostsListModel>> {
    return this.apiBaseService.get(CasePostsMethods.Main, model);
  }

  getPostForView(
    id: number
  ): Observable<OperationDataResult<CasePostViewModel>> {
    return this.apiBaseService.get<CasePostViewModel>(
      CasePostsMethods.View + '/' + id
    );
  }

  createPost(model: CasePostCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(CasePostsMethods.Main, model);
  }
}
