import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AdvEntitySearchableItemModel,
  AdvEntitySelectableItemModel
} from 'src/app/common/models';
import {getRandomInt} from 'src/app/common/helpers';

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

  deleteAdvEntitySelectableItem(tempId: number) {
    this.entityItemModels = this.entityItemModels.filter(
      (x) => x.tempId !== tempId
    );
    this.actualizeAdvEntitySelectableItemPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  actualizeAdvEntitySelectableItemPositions() {
    for (let i = 0; i < this.entityItemModels.length; i++) {
      this.entityItemModels[i].entityItemUId = i.toString();
      this.entityItemModels[i].displayIndex = i;
      if(!this.entityItemModels[i].tempId)
      {
        this.entityItemModels[i].tempId = this.getRandId();
      }
    }
  }

  dragulaPositionChanged() {
    this.actualizeAdvEntitySelectableItemPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  onOpenModalEditName(entityItem: AdvEntitySelectableItemModel | AdvEntitySearchableItemModel) {
    this.openEditNameModal.emit(entityItem);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.entityItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
