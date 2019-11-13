import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel
} from 'src/app/common/models/advanced';
import {EntitySelectService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-entity-select-create',
  templateUrl: './entity-select-create.component.html',
  styleUrls: ['./entity-select-create.component.scss']
})
export class EntitySelectCreateComponent implements OnInit {
  advEntitySelectableGroupCreateModel: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalSelectEditName', { static: true }) modalSelectEditName;
  @Output() onEntityGroupCreated: EventEmitter<void> = new EventEmitter<void>();
  seletctedItem: AdvEntitySelectableItemModel = new AdvEntitySelectableItemModel();
  spinnerStatus = false;

  items = [];

  constructor(private entitySelectService: EntitySelectService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  openModalSelectEditName(itemModel: AdvEntitySelectableItemModel) {
    this.seletctedItem = itemModel;
    this.modalSelectEditName.show();
  }

  createEntitySelectableGroup() {
    this.spinnerStatus = true;
    this.entitySelectService.createEntitySelectableGroup(this.advEntitySelectableGroupCreateModel).subscribe((data) => {
      if (data && data.success) {
        this.onEntityGroupCreated.emit();
        this.frame.hide();
        this.advEntitySelectableGroupCreateModel = new AdvEntitySelectableGroupEditModel();
      }
      this.spinnerStatus = false;
    });
  }

  addNewAdvEntitySelectableItem() {
    const item = new AdvEntitySelectableItemModel();
    item.entityItemUId = this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.length.toString();
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.push(item);
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels =
      this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels
        .filter(x => x.entityItemUId != itemId);
    this.actualizeAdvEntitySelectableItemPositions();
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.length; i++) {
      this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels[i].entityItemUId = i.toString();
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
  }

  updateItem(itemModel: AdvEntitySelectableItemModel) {
    this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels
      .find(x => x.entityItemUId == itemModel.entityItemUId).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      for (let i = 0; i < lines.length; i++) {
        this.advEntitySelectableGroupCreateModel.advEntitySelectableItemModels.push(new AdvEntitySelectableItemModel(lines[i]));
      }
    }
  }
  closeFrame() {
    this.frame.hide();
  }
}
