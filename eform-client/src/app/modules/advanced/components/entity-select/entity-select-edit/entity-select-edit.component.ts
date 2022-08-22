import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  EntityGroupEditModel, EntityItemModel,
} from 'src/app/common/models/advanced';
import { EntitySelectService } from 'src/app/common/services/advanced';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {EntityItemEditNameComponent} from 'src/app/common/modules/eform-shared/components';
import {getRandomInt} from 'src/app/common/helpers';

@Component({
  selector: 'app-entity-select-edit',
  templateUrl: './entity-select-edit.component.html',
  styleUrls: ['./entity-select-edit.component.scss'],
})
export class EntitySelectEditComponent implements OnInit {
  advEntitySelectableGroupEditModel: EntityGroupEditModel = new EntityGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalNameEdit', { static: true }) modalNameEdit: EntityItemEditNameComponent;
  @Output() entityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupId: number;

  items = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private entitySelectService: EntitySelectService,
    private location: Location
  ) {
    this.activateRoute.params.subscribe((params) => {
      this.selectedGroupId = +params['id'];
    });
  }

  ngOnInit() {
    this.loadEntityGroup();
  }

  loadEntityGroup() {
    this.entitySelectService
      .getEntitySelectableGroup(this.selectedGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.advEntitySelectableGroupEditModel.name = data.model.name;
          this.advEntitySelectableGroupEditModel.description =
            data.model.description;
          this.advEntitySelectableGroupEditModel.entityItemModels =
            data.model.entityGroupItemLst;
          this.actualizeAdvEntitySelectableItemPositions();
          this.advEntitySelectableGroupEditModel.groupUid = this.selectedGroupId;
          this.advEntitySelectableGroupEditModel.isLocked = data.model.isLocked;
          this.advEntitySelectableGroupEditModel.isEditable =
            data.model.isEditable;
        }
      });
  }

  updateEntitySelectableGroup() {
    this.entitySelectService
      .updateEntitySelectableGroup(this.advEntitySelectableGroupEditModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.entityGroupEdited.emit();
          this.location.back();
        }
      });
  }

  goBack() {
    this.location.back();
    console.debug('goBack()...');
  }

  addNewAdvEntitySelectableItem() {
    const item = new EntityItemModel();
    item.entityItemUId = (
      this.advEntitySelectableGroupEditModel.entityItemModels
        .length + 1
    ).toString();
    item.displayIndex =
      this.advEntitySelectableGroupEditModel.entityItemModels
        .length + 1;
    this.advEntitySelectableGroupEditModel.entityItemModels.push(
      item
    );
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySelectableGroupEditModel.entityItemModels.length; i++) {
      this.advEntitySelectableGroupEditModel.entityItemModels[i].entityItemUId = i.toString();
      this.advEntitySelectableGroupEditModel.entityItemModels[i].displayIndex = i;
      if(!this.advEntitySelectableGroupEditModel.entityItemModels[i].tempId){
        this.advEntitySelectableGroupEditModel.entityItemModels[i].tempId = this.getRandId();
      }
    }
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const startPosition = this.advEntitySelectableGroupEditModel.entityItemModels.length;
      const endPosition = startPosition + lines.length;
      let j = 0;
      for (let i = startPosition; i < endPosition; i++) {
        const item = new EntityItemModel(lines[j]);
        item.displayIndex = i;
        item.entityItemUId = i.toString();
        item.tempId = this.getRandId();
        this.advEntitySelectableGroupEditModel.entityItemModels.push(
          item
        );
        j++;
      }
    }
  }

  onItemUpdated(model: EntityItemModel) {
    const index = this.advEntitySelectableGroupEditModel.entityItemModels
      .findIndex(x => x.entityItemUId === model.entityItemUId);
    if (index !== -1) {
      this.advEntitySelectableGroupEditModel.entityItemModels[index] = model;
    }
  }

  onOpenEditNameModal(model: EntityItemModel) {
    this.modalNameEdit.show(model);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.advEntitySelectableGroupEditModel.entityItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
