import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CasePostViewModel} from '../../../../../common/models/cases';
import {CasePostsService} from '../../../../../common/services/cases';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-post-view',
  templateUrl: './case-post-view.component.html',
  styleUrls: ['./case-post-view.component.scss']
})
export class CasePostViewComponent implements OnInit, OnDestroy {
  @ViewChild(('frame'), {static: false}) frame;
  postViewModel: CasePostViewModel = new CasePostViewModel();
  getCasePost$: Subscription;
  spinnerStatus = false;
  constructor(private casePostsService: CasePostsService) { }

  ngOnInit() {
  }

  show(postId: number) {
    this.getPost(postId);
  }

  getPost(postId: number) {
    this.spinnerStatus = true;
    this.getCasePost$ = this.casePostsService.getPostForView(postId).subscribe((data) => {
      if (data && data.success) {
        this.postViewModel = data.model;
        this.frame.show();
      }
      this.spinnerStatus = false;
    });
  }

  ngOnDestroy(): void {
  }
}
