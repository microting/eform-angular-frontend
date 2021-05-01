import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageSettingsModel } from 'src/app/common/models/settings';
import { PlanningModel } from '../../../../models/plannings';
import {
  ItemsPlanningPnPlanningsService,
  ItemsPlanningPnTagsService,
} from '../../../../services';
import { PluginClaimsHelper } from 'src/app/common/helpers';
import { ItemsPlanningPnClaims } from '../../../../enums';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { PlanningTagsComponent } from '../../planning-additions/planning-tags/planning-tags.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  CommonDictionaryModel,
  FolderDto,
  Paged,
  SiteNameDto,
} from 'src/app/common/models';
import { FoldersService, SitesService } from 'src/app/common/services/advanced';
import { composeFolderName } from 'src/app/common/helpers/folder-name.helper';
import { AuthService } from 'src/app/common/services';
import * as R from 'ramda';
import { PlanningsStateService } from 'src/app/plugins/modules/items-planning-pn/components/plannings/state/plannings-state-service';

@AutoUnsubscribe()
@Component({
  selector: 'app-plannings-container',
  templateUrl: './plannings-container.component.html',
  styleUrls: ['./plannings-container.component.scss'],
})
export class PlanningsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('deletePlanningModal', { static: false }) deletePlanningModal;
  @ViewChild('deleteMultiplePlanningsModal', { static: false })
  deleteMultiplePlanningsModal;
  @ViewChild('modalCasesColumns', { static: false }) modalCasesColumnsModal;
  @ViewChild('assignSitesModal', { static: false }) assignSitesModal;
  @ViewChild('modalPlanningsImport', { static: false }) modalPlanningsImport;
  @ViewChild('planningTagsModal') planningTagsModal: PlanningTagsComponent;

  descriptionSearchSubject = new Subject();
  nameSearchSubject = new Subject();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  planningsModel: Paged<PlanningModel> = new Paged<PlanningModel>();
  availableTags: CommonDictionaryModel[] = [];
  foldersListDto: FolderDto[] = [];
  sitesDto: SiteNameDto[] = [];

  getPlanningsSub$: Subscription;
  getTagsSub$: Subscription;
  getFoldersListSub$: Subscription;
  getAllSites$: Subscription;
  deletePlanningsSub$: Subscription;
  selectedPlanningsCheckboxes = new Array<{
    planningId: number;
    checked: boolean;
  }>();
  allPlanningsCheckbox = false;

  constructor(
    private itemsPlanningPnPlanningsService: ItemsPlanningPnPlanningsService,
    private tagsService: ItemsPlanningPnTagsService,
    private foldersService: FoldersService,
    private sitesService: SitesService,
    private authService: AuthService,
    public planningsStateService: PlanningsStateService
  ) {
    this.nameSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.planningsStateService.updateNameFilter(val.toString());
      this.getPlannings();
    });
    this.descriptionSearchSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.planningsStateService.updateDescriptionFilter(val.toString());
      this.getPlannings();
    });
  }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get userRole() {
    return this.authService.currentRole;
  }

  get itemsPlanningPnClaims() {
    return ItemsPlanningPnClaims;
  }

  ngOnInit() {
    this.getAllInitialData();
  }

  getAllInitialData() {
    this.getTags();
    this.getAllSites();
    this.loadFoldersAndPlannings();
  }

  getAllSites() {
    this.getAllSites$ = this.sitesService
      .getAllSitesForPairing()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
  }

  getPlannings() {
    this.getPlanningsSub$ = this.planningsStateService
      .getAllPlannings()
      .subscribe((data) => {
        if (data && data.success) {
          // map folder names to items
          if (data.model.total > 0) {
            this.planningsModel = {
              ...data.model,
              entities: data.model.entities.map((x) => {
                return {
                  ...x,
                  folder: {
                    ...x.folder,
                    eFormSdkFolderName: composeFolderName(
                      x.folder.eFormSdkFolderId,
                      this.foldersListDto
                    ),
                  },
                };
              }),
            };
          } else {
            this.planningsModel = data.model;
          }
          // Required if page or anything else was changed
          this.resetAllPlanningsCheckboxes();
        }
      });
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getPlanningsTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  loadFoldersAndPlannings() {
    this.getFoldersListSub$ = this.foldersService
      .getAllFoldersList()
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.foldersListDto = operation.model;
          this.getPlannings();
        }
      });
  }

  deleteMultiplePlannings() {
    const planningsIds = this.selectedPlanningsCheckboxes.map((x) => {
      return x.planningId;
    });
    this.deletePlanningsSub$ = this.itemsPlanningPnPlanningsService
      .deletePlannings(planningsIds)
      .subscribe((data) => {
        if (data && data.success) {
          this.deleteMultiplePlanningsModal.hide();
          this.getPlannings();
        }
      });
  }

  showDeletePlanningModal(planning: PlanningModel) {
    this.deletePlanningModal.show(planning);
  }

  openEditColumnsModal(planning: PlanningModel) {
    this.modalCasesColumnsModal.show(planning);
  }

  sortTable(sort: string) {
    this.planningsStateService.onSortTable(sort);
    this.getPlannings();
  }

  changePage(newPage: any) {
    this.planningsStateService.changePage(newPage);
    this.getPlannings();
  }

  openAssignmentModal(planning: PlanningModel) {
    this.assignSitesModal.show(planning);
  }

  onDescriptionFilterChanged(description: string) {
    this.descriptionSearchSubject.next(description);
  }

  onNameFilterChanged(name: string) {
    this.nameSearchSubject.next(name);
  }

  openTagsModal() {
    this.planningTagsModal.show();
  }

  saveTag(e: any) {
    this.planningsStateService.addTagId(e.id);
    this.getPlannings();
  }

  removeSavedTag(e: any) {
    this.planningsStateService.removeTagId(e.value.id);
    this.getPlannings();
  }

  tagSelected(id: number) {
    this.planningsStateService.addTagId(id);
    this.getPlannings();
  }

  ngOnDestroy(): void {}

  openPlanningsImportModal() {
    this.modalPlanningsImport.show();
  }

  onSinglePlanningCheckboxChanged(model: {
    planningId: number;
    checked: boolean;
  }) {
    if (model.checked) {
      this.selectedPlanningsCheckboxes = [
        ...this.selectedPlanningsCheckboxes,
        { ...model },
      ];
    } else {
      const foundObject = this.selectedPlanningsCheckboxes.findIndex(
        (x) => x.planningId === model.planningId
      );
      if (foundObject > -1) {
        this.selectedPlanningsCheckboxes = R.remove(
          foundObject,
          1,
          this.selectedPlanningsCheckboxes
        );
      }
    }
  }

  onAllPlanningsCheckboxChanged(isChecked: boolean) {
    this.allPlanningsCheckbox = isChecked;
    this.selectedPlanningsCheckboxes = [];
    if (isChecked) {
      this.planningsModel.entities.map((x) => {
        this.selectedPlanningsCheckboxes = [
          ...this.selectedPlanningsCheckboxes,
          { planningId: x.id, checked: true },
        ];
      });
    }
  }

  resetAllPlanningsCheckboxes() {
    this.allPlanningsCheckbox = false;
    this.selectedPlanningsCheckboxes = [];
  }

  showDeleteMultiplePlanningsModal() {
    this.deleteMultiplePlanningsModal.show(
      this.selectedPlanningsCheckboxes.length
    );
  }

  onPageSizeChanged(newPageSize: number) {
    this.planningsStateService.updatePageSize(newPageSize);
    this.getPlannings();
  }

  planningDeleted() {
    this.planningsStateService.onDelete();
    this.getPlannings();
  }
}
