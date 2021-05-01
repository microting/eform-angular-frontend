import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReportEformItemModel} from '../../../models/report';
import {CasePostNewComponent} from 'src/app/modules/cases/components';
import {Subscription} from 'rxjs';
import {AuthService, EmailRecipientsService} from 'src/app/common/services';
import {CasePostsListModel, CommonDictionaryModel, EmailRecipientTagCommonModel} from 'src/app/common/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportTableComponent implements OnInit {
  @Input() items: ReportEformItemModel[] = [];
  @Input() dateFrom: any;
  @Input() dateTo: any;
  @Input() itemHeaders: {key: string, value: string}[] = [];
  @Input() newPostModal: any;

  constructor(
    private authService: AuthService) { }

  ngOnInit(): void {
  }


  openCreateModal(caseId: number, eformId: number, pdfReportAvailable: boolean) {
    this.newPostModal.caseId = caseId;
    this.newPostModal.efmroId = eformId;
    this.newPostModal.currentUserFullName = this.authService.currentUserFullName;
    this.newPostModal.pdfReportAvailable = pdfReportAvailable;
    this.newPostModal.show();
  }
}
