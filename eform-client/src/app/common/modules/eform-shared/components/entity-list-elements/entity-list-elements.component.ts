import {
  Component,
  EventEmitter,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  EntityItemModel,
} from 'src/app/common/models';
import {getRandomInt} from 'src/app/common/helpers';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-entity-list-elements',
  templateUrl: './entity-list-elements.component.html',
  styleUrls: ['./entity-list-elements.component.scss'],
})
export class EntityListElementsComponent implements OnInit, OnDestroy {
  @Input() entityItemModels: EntityItemModel[] = [];
  @Output() entityItemModelsChanged: EventEmitter<Array<EntityItemModel>> =
    new EventEmitter<Array<EntityItemModel>>();
  @Output() openEditNameModal: EventEmitter<EntityItemModel> =
    new EventEmitter<EntityItemModel>();
  constructor(private dragulaService: DragulaService,) {
    this.dragulaService.createGroup('ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle') && container.classList.contains('dragula-container');
      },
      isContainer: (el) => {
        return el.classList.contains('dragula-container');
      },
      accepts: (target) => {
        return target.classList.contains('dragula-item') || target.parentElement.classList.contains('dragula-container');
      },
      direction: 'vertical'
    });
  }

  ngOnInit() {
  }

  deleteEntityItem(tempId: number) {
    this.entityItemModels = this.entityItemModels.filter(
      (x) => x.tempId !== tempId
    );
    this.actualizeEntityItemsPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  actualizeEntityItemsPositions() {
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
    this.actualizeEntityItemsPositions();
    this.entityItemModelsChanged.emit(this.entityItemModels);
  }

  onOpenModalEditName(entityItem: EntityItemModel) {
    this.openEditNameModal.emit(entityItem);
  }

  getRandId(): number{
    const randId = getRandomInt(1, 1000);
    if(this.entityItemModels.findIndex(x => x.tempId === randId) !== -1){
      return this.getRandId();
    }
    return randId;
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('ITEMS');
  }
}
