import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {SurveyConfigModel} from '../../../models/survey/survey-config.model';

@Component({
  selector: 'app-survey-configuration-status',
  templateUrl: './survey-configuration-status.component.html',
  styleUrls: ['./survey-configuration-status.component.scss']
})
export class SurveyConfigurationStatusComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() configStatusChanged: EventEmitter<SurveyConfigModel> = new EventEmitter<SurveyConfigModel>();
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();

  constructor(private surveyConfigsService: InsightDashboardPnSurveyConfigsService) {
  }

  ngOnInit() {
  }

  show(model: SurveyConfigModel) {
    this.selectedSurveyConfig = model;
    this.frame.show();
  }

  changeSurveyConfigStatus() {
    this.surveyConfigsService.changeStatus({id: this.selectedSurveyConfig.id, isActive: !this.selectedSurveyConfig.isActive})
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.configStatusChanged.emit();
        }
      });
  }
}
