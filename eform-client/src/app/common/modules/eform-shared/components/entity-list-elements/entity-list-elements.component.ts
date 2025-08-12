import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {getRandomInt} from 'src/app/common/helpers';
import {EntityItemModel} from 'src/app/common/models';

@Component({
  selector: 'app-entity-list-elements',
  templateUrl: './entity-list-elements.component.html',
  styleUrls: ['./entity-list-elements.component.scss'],
  standalone: false
})
export class EntityListElementsComponent {
  @Input() entityItemModels: any[] = [];
  @Output() entityItemModelsChanged: EventEmitter<Array<EntityItemModel>> =
    new EventEmitter<Array<EntityItemModel>>();
  @Output() openEditNameModal: EventEmitter<EntityItemModel> =
    new EventEmitter<EntityItemModel>();

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.entityItemModels, event.previousIndex, event.currentIndex);
    this.dragulaPositionChanged(); // Call your existing handler if needed
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
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  onOpenModalEditName(entityItem: any) {
    this.openEditNameModal.emit(entityItem);
  }

  deleteEntityItem(tempId: any) {
    this.entityItemModels = this.entityItemModels.filter(
      item => item.tempId !== tempId
    );
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.entityItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }
}
