import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableItemModel} from 'src/app/common/models/advanced';

@Component({
  selector: 'app-entity-select-edit-name',
  templateUrl: './entity-select-edit-name.component.html',
  styleUrls: ['./entity-select-edit-name.component.scss']
})
export class EntitySelectEditNameComponent implements OnInit {
  @Output() onItemUpdated: EventEmitter<AdvEntitySelectableItemModel> = new EventEmitter<AdvEntitySelectableItemModel>();
  @ViewChild('frame') frame;
  @Input() selectedAdvEntitySelectableItemModel: AdvEntitySelectableItemModel = new AdvEntitySelectableItemModel;
  name: string;
  constructor() { }

  ngOnInit() {
  }

  show(name?: string) {
    if (name) {
      this.name = name;
    }
    this.frame.show();
  }

  updateItem() {
    this.frame.hide();
    this.selectedAdvEntitySelectableItemModel.name = this.name;
    this.name = '';
    this.onItemUpdated.emit(this.selectedAdvEntitySelectableItemModel);
  }

}
