import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CasePostViewModel} from 'src/app/common/models';
import {CasePostsService} from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-case-post-view',
  templateUrl: './case-post-view.component.html',
  styleUrls: ['./case-post-view.component.scss']
})
export class CasePostViewComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Input() currentUserFullName: string;
  @Input() pdfReportAvailable: boolean;
  postViewModel: CasePostViewModel = new CasePostViewModel();
  getCasePost$: Subscription;
  constructor(private casePostsService: CasePostsService) { }

  ngOnInit() {
  }

  show(postId: number) {
    this.getPost(postId);
  }

  getPost(postId: number) {
    this.getCasePost$ = this.casePostsService.getPostForView(postId).subscribe((data) => {
      if (data && data.success) {
        this.postViewModel = data.model;
        this.frame.show();
      }
    });
  }

  ngOnDestroy(): void {
  }
}
