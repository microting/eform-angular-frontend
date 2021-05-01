import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SurveyConfigsListModel } from '../../../models';
import { SurveyConfigModel } from '../../../models/survey/survey-config.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  SurveyConfigurationDeleteComponent,
  SurveyConfigurationEditComponent,
  SurveyConfigurationNewComponent,
  SurveyConfigurationStatusComponent,
} from '../..';
import {
  InsightDashboardPnDashboardDictionariesService,
  InsightDashboardPnSurveyConfigsService,
} from '../../../services';
import {
  CommonDictionaryModel,
  TableHeaderElementModel,
} from '../../../../../../common/models/common';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SitesService } from 'src/app/common/services';
import { SurveysStateService } from '../state/surveys-state-service';

@AutoUnsubscribe()
@Component({
  selector: 'app-insight-dashboard-surveys',
  templateUrl: './survey-configurations-page.component.html',
  styleUrls: ['./survey-configurations-page.component.scss'],
})
export class SurveyConfigurationsPageComponent implements OnInit, OnDestroy {
  @ViewChild('newSurveyConfigModal', { static: true })
  newSurveyConfigModal: SurveyConfigurationNewComponent;
  @ViewChild('editSurveyConfigModal', { static: true })
  editSurveyConfigModal: SurveyConfigurationEditComponent;
  @ViewChild('statusSurveyConfigModal', { static: true })
  statusSurveyConfigModal: SurveyConfigurationStatusComponent;
  @ViewChild('deleteSurveyConfigModal', { static: true })
  deleteSurveyConfigModal: SurveyConfigurationDeleteComponent;
  surveyConfigurationsListModel: SurveyConfigsListModel = new SurveyConfigsListModel();
  availableSurveys: CommonDictionaryModel[] = [];
  locations: CommonDictionaryModel[] = [];
  searchSubject = new Subject();
  getSurveyConfigsSub$: Subscription;
  getSurveysSub$: Subscription;
  getLocationsSub$: Subscription;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    {
      name: 'SurveyName',
      elementId: 'surveyNameTableHeader',
      sortable: true,
      visibleName: 'Survey Name',
    },
    {
      name: 'LocationName',
      elementId: 'locationNameTableHeader',
      sortable: false,
      visibleName: 'Location Name',
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private surveyConfigsService: InsightDashboardPnSurveyConfigsService,
    private dictionariesService: InsightDashboardPnDashboardDictionariesService,
    private sitesService: SitesService,
    public surveysStateService: SurveysStateService
  ) {
    this.searchSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.surveysStateService.updateNameFilter(val);
      this.getSurveyConfigsList();
    });
  }

  ngOnInit() {
    this.getSurveyConfigsList();
    this.getLocations();
    this.getSurveys();
  }

  getSurveyConfigsList() {
    this.getSurveyConfigsSub$ = this.surveysStateService
      .getAll()
      .subscribe((data) => {
        if (data && data.success) {
          this.surveyConfigurationsListModel = data.model;
        }
      });
  }

  getSurveys() {
    this.getSurveysSub$ = this.dictionariesService
      .getSurveys()
      .subscribe((data) => {
        if (data && data.success) {
          this.availableSurveys = data.model;
        }
      });
  }

  getLocations() {
    this.getLocationsSub$ = this.sitesService
      .getAllSitesDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.locations = data.model;
        }
      });
  }

  sortTable(sort: string) {
    this.surveysStateService.onSortTable(sort);
    this.getSurveyConfigsList();
  }

  changePage(offset: any) {
    this.surveysStateService.changePage(offset);
    this.getSurveyConfigsList();
  }

  onSearchInputChanged(searchValue: string) {
    this.searchSubject.next(searchValue);
  }

  openEditModal(surveyConfig: SurveyConfigModel) {
    this.editSurveyConfigModal.show(surveyConfig);
  }

  openDeleteModal(surveyConfig: SurveyConfigModel) {
    this.deleteSurveyConfigModal.show(surveyConfig);
  }

  openCreateModal() {
    this.newSurveyConfigModal.show();
  }

  openStatusModal(surveyConfig: SurveyConfigModel) {
    this.statusSurveyConfigModal.show(surveyConfig);
  }

  ngOnDestroy(): void {}

  onPageSizeChanged(pageSize: number) {
    this.surveysStateService.updatePageSize(pageSize);
    this.getSurveyConfigsList();
  }

  surveyConfigDeleted() {
    this.surveysStateService.checkOffset();
    this.getSurveyConfigsList();
  }
}
