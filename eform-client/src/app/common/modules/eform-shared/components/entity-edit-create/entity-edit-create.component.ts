import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  EntityGroupEditModel,
  EntityItemModel,
} from 'src/app/common/models';
import {
  EntitySearchService, EntitySelectService,
} from 'src/app/common/services';
import { Location } from '@angular/common';
import {EntityImportListComponent, EntityItemEditNameComponent} from 'src/app/common/modules/eform-shared/components';
import {dialogConfigHelper, getRandomInt} from 'src/app/common/helpers';
import {ActivatedRoute} from '@angular/router';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';

@AutoUnsubscribe()
@Component({
  selector: 'app-entity-edit-create',
  templateUrl: './entity-edit-create.component.html',
  styleUrls: ['./entity-edit-create.component.scss'],
})
export class EntityEditCreateComponent implements OnInit, OnDestroy{
  entityGroupEditModel: EntityGroupEditModel = new EntityGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalNameEdit', { static: true }) modalNameEdit: EntityItemEditNameComponent;
  @Output() entityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  header: 'searchable' | 'selectable';
  selectedGroupId: number;
  edit: boolean;

  items = [];
  activateRouteDataSub$: Subscription;
  activateRouteParamsSub$: Subscription;
  getEntitySelectableGroupSub$: Subscription;
  getEntitySearchableGroupSub$: Subscription;
  createEntitySelectableGroupSub$: Subscription;
  createEntitySearchableGroupSub$: Subscription;
  updateEntitySelectableGroupSub$: Subscription;
  updateEntitySearchableGroupSub$: Subscription;
  entitySearchImportListComponentAfterClosedSub$: Subscription;
  entityItemEditNameComponentAfterClosedSub$: Subscription;

  get title(): string {
    return `${this.edit ? 'Edit' : 'Create'} ${this.header} list`
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private entitySearchService: EntitySearchService,
    private entitySelectService: EntitySelectService,
    private location: Location,
    public dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnInit() {
    this.activateRouteDataSub$ = this.activateRoute.data.subscribe((data) => {
      this.header = data['header'];
    });
    this.activateRouteParamsSub$ = this.activateRoute.params
      .subscribe((params) => {
        this.selectedGroupId = +params['id'];
        this.edit = !!this.selectedGroupId;
        if(this.edit) {
          this.loadEntityGroup();
        }
      });
  }

  loadEntityGroup() {
    if(this.header === 'searchable') {
      this.getEntitySearchableGroupSub$ = this.entitySearchService
        .getEntitySearchableGroup(this.selectedGroupId)
        .subscribe((data) => {
          if (data && data.success) {
            this.entityGroupEditModel = {
              ...this.entityGroupEditModel,
              name: data.model.name,
              entityItemModels: data.model.entityGroupItemLst,
              groupUid: this.selectedGroupId,
              isLocked: data.model.isLocked,
              isEditable: data.model.isEditable,
              description: data.model.description,
            }
            this.actualizeEntityItemPositions();
          }
        });
    } else if (this.header === 'selectable'){
      this.getEntitySelectableGroupSub$ = this.entitySelectService
        .getEntitySelectableGroup(this.selectedGroupId)
        .subscribe((data) => {
          if (data && data.success) {
            this.entityGroupEditModel = {
              ...this.entityGroupEditModel,
              name: data.model.name,
              entityItemModels: data.model.entityGroupItemLst,
              groupUid: this.selectedGroupId,
              isLocked: data.model.isLocked,
              isEditable: data.model.isEditable,
              description: data.model.description,
            }
            this.actualizeEntityItemPositions();
          }
        });
    }
  }

  updateEntityGroup() {
    if(this.header === 'searchable') {
      this.updateEntitySearchableGroupSub$ = this.entitySearchService
        .updateEntitySearchableGroup(this.entityGroupEditModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.goBack(true);
          }
        });
    } else if (this.header === 'selectable'){
      this.updateEntitySelectableGroupSub$ = this.entitySelectService
        .updateEntitySelectableGroup(this.entityGroupEditModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.goBack(true);
          }
        });
    }
  }

  createEntityGroup() {
    if(this.header === 'searchable') {
      this.createEntitySearchableGroupSub$ = this.entitySearchService
        .createEntitySearchableGroup(this.entityGroupEditModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.goBack(true);
          }
        });
    } else if (this.header === 'selectable'){
      this.createEntitySelectableGroupSub$ = this.entitySelectService
        .createEntitySelectableGroup(this.entityGroupEditModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.goBack(true);
          }
        });
    }
  }

  goBack(result = false) {
    if(result) {
      this.entityGroupEdited.emit();
    }
    this.location.back();
    console.debug('goBack()...');
  }

  addNewEntityItem() {
    const item = new EntityItemModel();
    item.entityItemUId = (
      this.entityGroupEditModel.entityItemModels
        .length + 1
    ).toString();
    item.displayIndex =
      this.entityGroupEditModel.entityItemModels
        .length + 1;
    this.entityGroupEditModel.entityItemModels.push(
      item
    );
    this.actualizeEntityItemPositions();
  }

  actualizeEntityItemPositions() {
    const mas = this.entityGroupEditModel.entityItemModels;
    for (let i = 0; i < mas.length; i++) {
      mas[i].entityItemUId = i.toString();
      mas[i].displayIndex = i;
      if(!mas[i].tempId){
        mas[i].tempId = this.getRandId();
      }
    }
    this.entityGroupEditModel.entityItemModels = mas;
  }

  importEntityGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const startPosition = this.entityGroupEditModel
        .entityItemModels.length;
      const endPosition = startPosition + lines.length;
      let j = 0;
      for (let i = startPosition; i < endPosition; i++) {
        const obj = new EntityItemModel(lines[j]);
        obj.displayIndex = i;
        obj.entityItemUId = String(i);
        obj.tempId = this.getRandId();
        this.entityGroupEditModel.entityItemModels.push(
          obj
        );
        j++;
      }
      this.actualizeEntityItemPositions();
    }
  }

  onItemUpdated(model: EntityItemModel) {
    const index = this.entityGroupEditModel.entityItemModels
      .findIndex(x => x.entityItemUId === model.entityItemUId);
    if (index !== -1) {
      this.entityGroupEditModel.entityItemModels[index] = model;
    }
  }

  onOpenEditNameModal(model: EntityItemModel) {
    const modal = this.dialog.open(EntityItemEditNameComponent, {...dialogConfigHelper(this.overlay, model), minWidth: 500});
    this.entityItemEditNameComponentAfterClosedSub$ = modal
      .afterClosed().subscribe(data => data.result ? this.onItemUpdated(data.data) : undefined);
  }

  openImportEntityGroup() {
    this.entitySearchImportListComponentAfterClosedSub$ = this.dialog.open(EntityImportListComponent,
      {...dialogConfigHelper(this.overlay), minWidth: 500})
      .afterClosed().subscribe(data => data.result ? this.importEntityGroup(data.data) : undefined);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.entityGroupEditModel.entityItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }

  ngOnDestroy(): void {
  }
}
