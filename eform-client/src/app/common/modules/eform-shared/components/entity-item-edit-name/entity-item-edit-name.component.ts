import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySearchableItemModel, AdvEntitySelectableItemModel} from 'src/app/common/models/advanced';

@Component({
  selector: 'app-entity-item-edit-name',
  templateUrl: './entity-item-edit-name.component.html',
  styleUrls: ['./entity-item-edit-name.component.scss']
})
export class EntityItemEditNameComponent implements OnInit {
  @Output() itemUpdated: EventEmitter<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel>
    = new EventEmitter<AdvEntitySelectableItemModel | AdvEntitySearchableItemModel>();
  @Output() modalHided: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  selectedEntityItemModel: AdvEntitySelectableItemModel | AdvEntitySearchableItemModel
  = {description: '', displayIndex: 0, entityItemUId: '', workflowState: '', name: ''};
  constructor() { }

  ngOnInit() {
  }

  show(model: AdvEntitySelectableItemModel | AdvEntitySearchableItemModel) {
    this.selectedEntityItemModel = {...this.selectedEntityItemModel, ...model};
    this.frame.show();
  }

  hide(){
    this.selectedEntityItemModel = {description: '', displayIndex: 0, entityItemUId: '', name: '', workflowState: ''};
    this.frame.hide();
    this.modalHided.emit();
  }

  updateItem() {
    this.itemUpdated.emit(this.selectedEntityItemModel);
    this.hide();
    this.modalHided.emit();
  }

}
