import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {EntityGroupModel} from 'src/app/common/models';
import {EntitySelectService} from 'src/app/common/services';

@Component({
  selector: 'app-entity-select-remove',
  templateUrl: './entity-select-remove.component.html',
  styleUrls: ['./entity-select-remove.component.scss']
})
export class EntitySelectRemoveComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onEntityRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupModel: EntityGroupModel = new EntityGroupModel();
  constructor(private entitySelectService: EntitySelectService) { }

  ngOnInit() {
  }

  show(selectedGroup: EntityGroupModel) {
    this.selectedGroupModel = selectedGroup;
    this.frame.show();
  }

  deleteSelectedAdvEntitySelectableGroup() {
    this.entitySelectService.deleteEntitySelectableGroup(this.selectedGroupModel.microtingUUID).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.onEntityRemoved.emit();
      }
    });
  }

}
