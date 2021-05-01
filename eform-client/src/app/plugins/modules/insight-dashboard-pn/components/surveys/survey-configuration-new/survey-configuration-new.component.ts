import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InsightDashboardPnSurveyConfigsService} from '../../../services';
import {CommonDictionaryModel} from '../../../../../../common/models/common';

@Component({
  selector: 'app-survey-configuration-new',
  templateUrl: './survey-configuration-new.component.html',
  styleUrls: ['./survey-configuration-new.component.scss']
})
export class SurveyConfigurationNewComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input() locations: CommonDictionaryModel[] = [];
  @Input() surveys: CommonDictionaryModel[] = [];
  @Output() configCreated: EventEmitter<void> = new EventEmitter<void>();
  selectedSurveyId: number;
  selectedLocations: number[] = [];


  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService
  ) {
  }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createConfig() {
    this.surveyConfigsService.create({locationsIds: this.selectedLocations, surveyId: this.selectedSurveyId})
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.configCreated.emit();
          this.selectedLocations = [];
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
