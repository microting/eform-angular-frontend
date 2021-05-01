import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {InsightDashboardPnDashboardsService} from '../../../services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {CommonDictionaryExtendedModel} from '../../../models/common-dictionary-extended.model';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-new',
  templateUrl: './dashboard-new.component.html',
  styleUrls: ['./dashboard-new.component.scss']
})
export class DashboardNewComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: true }) frame;
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() dashboardCreated: EventEmitter<number> = new EventEmitter<number>();
  @Output() surveySelected: EventEmitter<number> = new EventEmitter<number>();
  selectedSurveyId: number;
  createDashboard$: Subscription;
  dashboardName: string;


  constructor(private dashboardsService: InsightDashboardPnDashboardsService) {
  }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createDashboard() {
    this.createDashboard$ = this.dashboardsService.create({
      name: this.dashboardName,
      surveyId: this.selectedSurveyId,
    }).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.dashboardCreated.emit(data.model);
      }
    });
  }

  onSurveySelected(surveyId: number) {
    this.surveySelected.emit(surveyId);
  }

  ngOnDestroy(): void {
  }
}
