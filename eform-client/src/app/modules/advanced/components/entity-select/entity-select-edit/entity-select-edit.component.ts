import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models/advanced';
import {EntitySelectService} from 'src/app/common/services/advanced';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-entity-select-edit',
  templateUrl: './entity-select-edit.component.html',
  styleUrls: ['./entity-select-edit.component.scss']
})
export class EntitySelectEditComponent implements OnInit {
  advEntitySelectableGroupEditModel: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalSelectEditName', { static: true }) modalSelectEditName;
  @Output() onEntityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  selectedItem: AdvEntitySelectableItemModel = new AdvEntitySelectableItemModel();
  selectedGroupId: number;

  items = [];

  constructor(private activateRoute: ActivatedRoute,
              private entitySelectService: EntitySelectService,
              private location: Location) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.selectedGroupId = +params['id'];
    });
  }

  ngOnInit() {
    // this.selectedGroupId = params['id'];
    this.selectedItem = new AdvEntitySelectableItemModel();
    // this.frame.show();
    this.loadEntityGroup();
  }

  show(groupId: string) {
    // this.id = +params['id'];
  }

  openModalSelectEditName(itemModel: AdvEntitySelectableItemModel) {
    this.selectedItem = itemModel;
    this.modalSelectEditName.show(this.selectedItem.name);
  }

  loadEntityGroup() {
    this.entitySelectService.getEntitySelectableGroup(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.advEntitySelectableGroupEditModel.name = data.model.name;
        this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels = data.model.entityGroupItemLst;
        this.advEntitySelectableGroupEditModel.groupUid = this.selectedGroupId;
        this.advEntitySelectableGroupEditModel.isLocked = data.model.isLocked;
      }
    });
  }

  updateEntitySelectableGroup() {
    this.entitySelectService.updateEntitySelectableGroup(this.advEntitySelectableGroupEditModel).subscribe((data) => {
      if (data && data.success) {
        this.onEntityGroupEdited.emit();
        this.location.back();
      }
    });
  }

  goBack() {
    // window.history.back();
    this.location.back();

    console.log( 'goBack()...' );
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = (this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length + 1).toString();
    item.displayIndex = this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length + 1;
    this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.push(item);
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels =
      this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels
        .filter(x => x.entityItemUId !== itemId);
    this.actualizeAdvEntitySelectableItemPositions();
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length; i++) {
      this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i].entityItemUId = i.toString();
      this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels[i].displayIndex = i;
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
  }

  updateItem(itemModel: AdvEntitySelectableItemModel) {
    this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels
      .find(x => x.entityItemUId === itemModel.entityItemUId).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const item = new AdvEntitySelectableItemModel();
        item.entityItemUId = (this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length).toString();
        item.name = lines[i];
        item.displayIndex = this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.length + 1;
        this.advEntitySelectableGroupEditModel.advEntitySelectableItemModels.push(item);
      }
    }
  }
}
