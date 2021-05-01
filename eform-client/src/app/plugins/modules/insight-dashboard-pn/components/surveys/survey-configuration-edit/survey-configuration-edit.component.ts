import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../../common/models/common';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {SurveyConfigModel} from '../../../models/survey/survey-config.model';

@Component({
  selector: 'app-survey-configuration-edit',
  templateUrl: './survey-configuration-edit.component.html',
  styleUrls: ['./survey-configuration-edit.component.scss']
})
export class SurveyConfigurationEditComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input() locations: CommonDictionaryModel[] = [];
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() configUpdated: EventEmitter<void> = new EventEmitter<void>();
  extendedLocations: { id: number, name: string, isChecked: boolean }[] = [];
  selectedLocations: number[] = [];
  selectedSurveyConfig: SurveyConfigModel = new SurveyConfigModel();


  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService
  ) {
  }

  show(surveyConfig: SurveyConfigModel) {
    this.selectedSurveyConfig = surveyConfig;
    this.extendedLocations = this.locations.map(x => {
      return {id: x.id, name: x.name, isChecked: surveyConfig.locations.findIndex(y => y.id === x.id) > -1};
    });
    this.selectedLocations = surveyConfig.locations.map(x => x.id);
    this.frame.show();
  }

  ngOnInit() {
  }

  updateConfig() {
    this.surveyConfigsService.update({
      locationsIds: this.selectedLocations,
      surveyId: this.selectedSurveyConfig.surveyId,
      id: this.selectedSurveyConfig.id
    })
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.configUpdated.emit();
        }
      });
  }

  addToArray(e: any, locationId: number) {
    if (e.target.checked) {
      this.selectedLocations.push(locationId);
    } else {
      this.selectedLocations = this.selectedLocations.filter(x => x !== locationId);
    }
  }
}
