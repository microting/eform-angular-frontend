import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel,
} from 'src/app/common/models/advanced';
import {
  EntitySearchService,
  EntitySelectService,
} from 'src/app/common/services/advanced';
import { Location } from '@angular/common';

@Component({
  selector: 'app-entity-search-create',
  templateUrl: './entity-search-create.component.html',
  styleUrls: ['./entity-search-create.component.scss'],
})
export class EntitySearchCreateComponent implements OnInit {
  advEntitySearchableGroupCreateModel: AdvEntitySearchableGroupEditModel = new AdvEntitySearchableGroupEditModel();
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('modalSearchEditName', { static: true }) modalSearchEditName;
  @Output() onEntityGroupCreated: EventEmitter<void> = new EventEmitter<void>();
  seletctedItem: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel();

  items = [];

  constructor(
    private entitySearchService: EntitySearchService,
    private location: Location
  ) {}

  ngOnInit() {}

  show() {
    this.frame.show();
    this.advEntitySearchableGroupCreateModel.name = '';
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels = [];
  }

  openModalSearchEditName(itemModel: AdvEntitySearchableItemModel) {
    this.seletctedItem = itemModel;
    this.modalSearchEditName.show();
  }

  createEntitySearchableGroup() {
    this.entitySearchService
      .createEntitySearchableGroup(this.advEntitySearchableGroupCreateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onEntityGroupCreated.emit();
          this.advEntitySearchableGroupCreateModel = new AdvEntitySearchableGroupEditModel();
          // this.frame.hide();
          this.location.back();
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
    item.entityItemUId = this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.length.toString();
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.push(
      item
    );
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    // eslint-disable-next-line max-len
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels = this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.filter(
      (x) => x.entityItemUId !== itemId
    );
    this.actualizeAdvEntitySelectableItemPositions();
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (
      let i = 0;
      i <
      this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels
        .length;
      i++
    ) {
      this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels[
        i
      ].entityItemUId = i.toString();
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
  }

  updateItem(itemModel: AdvEntitySearchableItemModel) {
    this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.find(
      (x) => x.entityItemUId === itemModel.entityItemUId
    ).name = itemModel.name;
  }

  importAdvEntitySelectableGroup(importString: string) {
    if (importString) {
      const lines = importString.split('\n');
      for (let i = 0; i < lines.length; i++) {
        this.advEntitySearchableGroupCreateModel.advEntitySearchableItemModels.push(
          new AdvEntitySelectableItemModel(lines[i])
        );
      }
    }
  }
}
