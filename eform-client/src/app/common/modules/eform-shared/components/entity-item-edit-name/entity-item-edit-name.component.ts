import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {EntityItemModel} from 'src/app/common/models/advanced';

@Component({
  selector: 'app-entity-item-edit-name',
  templateUrl: './entity-item-edit-name.component.html',
  styleUrls: ['./entity-item-edit-name.component.scss']
})
export class EntityItemEditNameComponent implements OnInit {
  @Output() itemUpdated: EventEmitter<EntityItemModel>
    = new EventEmitter<EntityItemModel>();
  @Output() modalHided: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  selectedEntityItemModel: EntityItemModel
  = {description: '', displayIndex: 0, entityItemUId: '', workflowState: '', name: ''};
  constructor() { }

  ngOnInit() {
  }

  show(model: EntityItemModel) {
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
