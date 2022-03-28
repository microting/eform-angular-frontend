import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, ViewChild,
} from '@angular/core';
import {
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel
} from 'src/app/common/models';
import {EntityItemEditNameComponent} from '../';

@Component({
  selector: 'app-entity-list-elements',
  templateUrl: './entity-list-elements.component.html',
  styleUrls: ['./entity-list-elements.component.scss'],
})
export class EntityListElementsComponent implements OnInit {
  @Input() entityItemModels: Array<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel> = [];
  @Output() entityItemModelsChanged: EventEmitter<Array<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel>> =
    new EventEmitter<Array<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel>>();
  @Output() openEditNameModal: EventEmitter<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel> =
    new EventEmitter<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel>();
  constructor() {
  }

  ngOnInit() {
  }

  deleteAdvEntitySelectableItem(itemId: string) {
    this.entityItemModels = this.entityItemModels.filter(
      (x) => x.entityItemUId !== itemId
    );
    this.actualizeAdvEntitySelectableItemPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.entityItemModels.length; i++) {
      this.entityItemModels[i].entityItemUId = i.toString();
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  onOpenModalEditName(entityItem: AdvEntitySelectableItemModel | AdvEntitySearchableItemModel) {
    this.openEditNameModal.emit(entityItem);
  }
}
