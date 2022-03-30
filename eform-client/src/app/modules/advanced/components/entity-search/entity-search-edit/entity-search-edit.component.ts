import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel, AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models/advanced';
import {
  EntitySearchService,
} from 'src/app/common/services/advanced';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EntityItemEditNameComponent } from 'src/app/common/modules/eform-shared/components';
import {getRandomInt} from 'src/app/common/helpers';

@Component({
  selector: 'app-entity-search-edit',
  templateUrl: './entity-search-edit.component.html',
  styleUrls: ['./entity-search-edit.component.scss'],
})
export class EntitySearchEditComponent implements OnInit {
  advEntitySearchableGroupEditModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalNameEdit', { static: true }) modalNameEdit: EntityItemEditNameComponent;
  @Output() entityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupId: number;

  items = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private entitySearchService: EntitySearchService,
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
    this.entitySearchService
      .getEntitySearchableGroup(this.selectedGroupId)
      .subscribe((data) => {
        if (data && data.success) {
          this.advEntitySearchableGroupEditModel.name = data.model.name;
          this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels =
            data.model.entityGroupItemLst;
          this.actualizeAdvEntitySelectableItemPositions();
          this.advEntitySearchableGroupEditModel.groupUid = this.selectedGroupId;
          this.advEntitySearchableGroupEditModel.isLocked = data.model.isLocked;
          this.advEntitySearchableGroupEditModel.isEditable =
            data.model.isEditable;
          this.advEntitySearchableGroupEditModel.description =
            data.model.description;
        }
      });
  }

  updateEntitySearchableGroup() {
    this.entitySearchService
      .updateEntitySearchableGroup(this.advEntitySearchableGroupEditModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.entityGroupEdited.emit();
          this.location.back();
          // this.frame.hide();
        }
      });
  }

  goBack() {
    // window.history.back();
    this.location.back();
    console.debug('goBack()...');
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = (
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
        .length + 1
    ).toString();
    item.displayIndex =
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
        .length + 1;
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(
      item
    );
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].entityItemUId = i.toString();
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].displayIndex = i;
      if(!this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].tempId){
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].tempId = this.getRandId();
      }
    }
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const startPosition = this.advEntitySearchableGroupEditModel
        .advEntitySearchableItemModels.length;
      const endPosition = startPosition + lines.length;
      let j = 0;
      for (let i = startPosition; i < endPosition; i++) {
        const obj = new AdvEntitySelectableItemModel(lines[j]);
        obj.displayIndex = i;
        obj.entityItemUId = String(i);
        obj.tempId = this.getRandId();
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(
          obj
        );
        j++;
      }
    }
  }

  onItemUpdated(model: AdvEntitySelectableItemModel) {
    const index = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
      .findIndex(x => x.entityItemUId === model.entityItemUId);
    if (index !== -1) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[index] = model;
    }
  }

  onOpenEditNameModal(model: AdvEntitySearchableItemModel) {
    this.modalNameEdit.show(model);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
