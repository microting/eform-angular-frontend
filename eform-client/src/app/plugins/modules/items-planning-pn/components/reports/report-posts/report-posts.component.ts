import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ReportEformPostModel} from '../../../models/report';

@Component({
  selector: 'app-report-posts',
  templateUrl: './report-posts.component.html',
  styleUrls: ['./report-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPostsComponent implements OnInit {
  @Input() posts: ReportEformPostModel[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
