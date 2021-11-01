import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel
} from 'src/app/common/models/advanced';
import {EntitySearchService, EntitySelectService} from 'src/app/common/services/advanced';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-entity-search-edit',
  templateUrl: './entity-search-edit.component.html',
  styleUrls: ['./entity-search-edit.component.scss']
})
export class EntitySearchEditComponent implements OnInit {
  advEntitySearchableGroupEditModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalSearchEditName', { static: true }) modalSearchEditName;
  @Output() onEntityGroupEdited: EventEmitter<void> = new EventEmitter<void>();
  selectedItem: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel();
  selectedGroupId: number;

  items = [];

  constructor(private activateRoute: ActivatedRoute,
              private entitySearchService: EntitySearchService,
              private location: Location) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.selectedGroupId = +params['id'];
    });
  }

  ngOnInit() {
    // this.selectedGroupId = groupId;
    this.selectedItem = new AdvEntitySearchableItemModel();
    // this.frame.show();
    this.loadEntityGroup();
  }

  show(groupId: number) {
  }

  openModalSearchEditName(itemModel: AdvEntitySearchableItemModel) {
    this.selectedItem = itemModel;
    this.modalSearchEditName.show(this.selectedItem.name);
  }

  loadEntityGroup() {
    this.entitySearchService.getEntitySearchableGroup(this.selectedGroupId).subscribe((data) => {
      if (data && data.success) {
        this.advEntitySearchableGroupEditModel.name = data.model.name;
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels = data.model.entityGroupItemLst;
        this.actualizeAdvEntitySelectableItemPositions();
        this.advEntitySearchableGroupEditModel.groupUid = this.selectedGroupId;
        this.advEntitySearchableGroupEditModel.isLocked = data.model.isLocked;
        this.advEntitySearchableGroupEditModel.isEditable = data.model.isEditable;
        this.advEntitySearchableGroupEditModel.description = data.model.description;
      }
    });
  }

  updateEntitySearchableGroup() {
    debugger;
    this.entitySearchService.updateEntitySearchableGroup(this.advEntitySearchableGroupEditModel).subscribe((data) => {
      if (data && data.success) {
        this.onEntityGroupEdited.emit();
        this.location.back();
        // this.frame.hide();
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
    item.entityItemUId = (this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length + 1).toString();
    item.displayIndex = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length + 1;
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(item);
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels =
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
        .filter(x => x.entityItemUId !== itemId);
    this.actualizeAdvEntitySelectableItemPositions();
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length; i++) {
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].entityItemUId = i.toString();
      this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels[i].displayIndex = i;
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
  }

  updateItem(itemModel: AdvEntitySearchableItemModel) {
    this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels
      .find(x => x.entityItemUId === itemModel.entityItemUId).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      const startPosition = this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.length;
      const endPosition = startPosition + lines.length;
      let j = 0;
      for (let i = startPosition; i < endPosition; i++) {
        const obj = new AdvEntitySelectableItemModel(lines[j]);
        obj.displayIndex = i;
        obj.entityItemUId = String(i);
        this.advEntitySearchableGroupEditModel.advEntitySearchableItemModels.push(obj);
        j++;
      }
    }
  }
}
