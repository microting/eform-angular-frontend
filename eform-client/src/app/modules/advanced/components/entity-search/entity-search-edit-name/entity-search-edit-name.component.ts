import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySearchableItemModel} from 'src/app/common/models/advanced';

@Component({
  selector: 'app-entity-search-edit-name',
  templateUrl: './entity-search-edit-name.component.html',
  styleUrls: ['./entity-search-edit-name.component.scss']
})
export class EntitySearchEditNameComponent implements OnInit {
  @Output() onItemUpdated: EventEmitter<AdvEntitySearchableItemModel> = new EventEmitter<AdvEntitySearchableItemModel>();
  @ViewChild('frame', { static: true }) frame;
  @Input() selectedAdvEntitySearchableItemModel: AdvEntitySearchableItemModel = new AdvEntitySearchableItemModel;
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
    this.selectedAdvEntitySearchableItemModel.name = this.name;
    this.name = '';
    this.onItemUpdated.emit(this.selectedAdvEntitySearchableItemModel);
  }

}
