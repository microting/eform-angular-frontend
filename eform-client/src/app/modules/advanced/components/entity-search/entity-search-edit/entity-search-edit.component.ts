import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel
} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-entity-search-edit',
  templateUrl: './entity-search-edit.component.html',
  styleUrls: ['./entity-search-edit.component.scss']
})
export class EntitySearchEditComponent implements OnInit {
  advEntitySearchableGroupEditModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('frame') frame;
  @ViewChild('modalSearchEditName') modalSearchEditName;
  @Output() onEntityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  selectedItem: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel();
  selectedGroupId: string;
  spinnerStatus = false;

  items = [];

  constructor(private entitySearchService: EntitySearchService) { }

  ngOnInit() {
  }

  show(groupId: string) {
    this.selectedGroupId = groupId;
    this.selectedItem = new AdvEntitySearchableItemModel();
    this.frame.show();
    this.loadEntityGroup();
  }

  openModalSearchEditName(itemModel: AdvEntitySearchableItemModel) {
    this.selectedItem = itemModel;
    this.modalSearchEditName.show(this.selectedItem.name);
  }

  loadEntityGroup() {
    this.spinnerStatus = true;
    this.entitySearchService.getEntitySearchableGroup(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.advEntitySearchableGroupEditModel.name = data.model.name;
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels = data.model.entityGroupItemLst;
        this.advEntitySearchableGroupEditModel.groupUid = this.selectedGroupId;
      }
      this.spinnerStatus = false;
    });
  }

  updateEntitySearchableGroup() {
    this.spinnerStatus = true;
    this.entitySearchService.updateEntitySearchableGroup(this.advEntitySearchableGroupEditModel).subscribe((data) => {
      if (data && data.success) {
        this.onEntityGroupEdited.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length.toString();
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(item);
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels =
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
        .filter(x => x.entityItemUId != itemId);
    this.actualizeAdvEntitySelectableItemPositions();
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].entityItemUId = i.toString();
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
  }

  updateItem(itemModel: AdvEntitySearchableItemModel) {
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
      .find(x => x.entityItemUId == itemModel.entityItemUId).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      for (let i = 0; i < lines.length; i++) {
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(new AdvEntitySelectableItemModel(lines[i]));
      }
    }
  }
}
