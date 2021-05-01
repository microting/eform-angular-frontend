import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SurveyConfigModel} from '../../../models/survey/survey-config.model';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';

@Component({
  selector: 'app-survey-configuration-delete',
  templateUrl: './survey-configuration-delete.component.html',
  styleUrls: ['./survey-configuration-delete.component.scss']
})
export class SurveyConfigurationDeleteComponent implements OnInit {
  @Output() surveyConfigDeleted: EventEmitter<void> = new EventEmitter<void>();
  surveyConfig: SurveyConfigModel = new SurveyConfigModel();
  @ViewChild('frame', { static: true }) frame;

  constructor(private surveyConfigsService: InsightDashboardPnSurveyConfigsService) { }

  show(surveyConfig: SurveyConfigModel) {
    this.surveyConfig = surveyConfig;
    this.frame.show();
  }

  ngOnInit() {
  }

  deleteSurveyConfig() {
    this.surveyConfigsService.remove(this.surveyConfig.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.surveyConfigDeleted.emit();
        }
      });
  }
}
