import {Component, OnDestroy, OnInit} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {InsightDashboardPnDashboardDictionariesService, InsightDashboardPnDashboardsService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardEditModel, DashboardItemModel, DashboardItemQuestionModel} from '../../../../models';
import {DragulaService} from 'ng2-dragula';
import {ToastrService} from 'ngx-toastr';
import {InsightDashboardPnCollapseService} from '../../../../services/insight-dashboard-pn-collapse.service';
import {DashboardItemQuestionTypesEnum} from '../../../../const/enums';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-edit-configuration',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  updateDashboardSub$: Subscription;
  filterQuestionsSub$: Subscription;
  collapseSub$: Subscription;
  getDashboardSub$: Subscription;
  getTagsSub$: Subscription;
  getLocationsSub$: Subscription;
  dashboardEditModel: DashboardEditModel = new DashboardEditModel();
  questions: DashboardItemQuestionModel[] = [];
  availableLocationsTags: any[] = [];
  isItemsCollapsed = false;
  selectedDashboardId: number;
  dragulaGroupName = 'ITEMS';

  constructor(private dashboardsService: InsightDashboardPnDashboardsService,
              private router: Router,
              private route: ActivatedRoute,
              private dictionaryService: InsightDashboardPnDashboardDictionariesService,
              private dragulaService: DragulaService,
              private toastrService: ToastrService,
              private collapseService: InsightDashboardPnCollapseService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      this.getDashboardForEdit(this.selectedDashboardId);
    });

    // create rule to disable dragula dnd if items is not collapsed
    this.dragulaService.createGroup(this.dragulaGroupName, {
      moves: (el, source, handle, sibling) => !el.classList.contains('no-drag')
    });

    this.collapseSub$ = this.collapseService.collapse.subscribe((data) => {
      this.isItemsCollapsed = data;
    });
  }

  updateDashboard() {
    if (this.dashboardEditModel.items.find(x => (x.firstQuestionId === null || x.period == null || x.chartType === null)
      && x.firstQuestionType !== DashboardItemQuestionTypesEnum.Text)) {
      this.toastrService.error('First question, period and chart type in item could not be empty!', 'Error', {timeOut: 10000});
    } else {
      this.updateDashboardSub$ = this.dashboardsService.update(this.dashboardEditModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.router.navigate(['../../', this.dashboardEditModel.id], {relativeTo: this.route}).then();
          }
        });
    }
  }

  getDashboardForEdit(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService.getSingleForEdit(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardEditModel = {...data.model};
        }
        this.getFilterQuestions(data.model.surveyId);
        this.getLocationTags(data.model.surveyId);
      });
  }

  getFilterQuestions(surveyId: number) {
    this.filterQuestionsSub$ = this.dictionaryService.getQuestions(surveyId)
      .subscribe((data) => {
        if (data && data.success) {
          this.questions = data.model;
        }
      });
  }

  getLocationTags(surveyId: number) {
    this.getLocationsSub$ = this.dictionaryService.getLocationBySurveyId(surveyId).subscribe((data) => {
      if (data && data.success) {
        this.getTags();
        this.availableLocationsTags = [...this.availableLocationsTags, ...data.model.map(x => {
          return {value: x.id, label: x.name, isTag: false};
        })];
      }
    });
  }

  getTags() {
    this.getTagsSub$ = this.dictionaryService.getTags().subscribe((data) => {
      if (data && data.success) {
        this.availableLocationsTags = [...this.availableLocationsTags, ...data.model.map(x => {
          return {value: x.id, label: x.name, isTag: true};
        })];
      }
    });
  }

  onAddNewBlock(position: number) {
    const newItem = new DashboardItemModel();
    this.dashboardEditModel.items.splice(position, 0, newItem);
    this.actualizeBlockPositions();
  }

  onCopyBlock(model: DashboardItemModel) {
    const modelCopy = {...model};
    delete modelCopy.id;
    this.dashboardEditModel.items.splice(model.position, 0, modelCopy);
    this.actualizeBlockPositions();
  }

  onDeleteBlock(position: number) {
    // Remove block on specific position
    this.dashboardEditModel.items =
      this.dashboardEditModel.items
        .filter(x => x.position !== position);
    this.actualizeBlockPositions();
  }

  ngOnDestroy(): void {
    // destroy dragula container
    this.dragulaService.destroy(this.dragulaGroupName);
    this.collapseService.collapse.next(false);
  }

  actualizeBlockPositions() {
    // Actualize position after any actions
    for (let i = 0; i < this.dashboardEditModel.items.length; i++) {
      this.dashboardEditModel.items[i].position = i + 1;
    }
  }

  dragulaPositionChanged(newItemsArray: DashboardItemModel[]) {
    this.dashboardEditModel.items = [...newItemsArray];
    this.actualizeBlockPositions();
  }

  onDashboardItemChanged(model: DashboardItemModel) {
    const foundDashboardItem = this.dashboardEditModel.items.findIndex(x => x.position === model.position);
    this.dashboardEditModel.items[foundDashboardItem] = model;
  }

  onDashboardChanged(model: DashboardEditModel) {
    this.dashboardEditModel = model;
  }

  toggleCollapse() {
    this.collapseService.updateState(!this.isItemsCollapsed);
  }
}
