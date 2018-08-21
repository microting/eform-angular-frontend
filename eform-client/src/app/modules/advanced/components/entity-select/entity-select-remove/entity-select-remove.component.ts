import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableGroupModel} from 'src/app/common/models/advanced';
import {EntitySelectService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-entity-select-remove',
  templateUrl: './entity-select-remove.component.html',
  styleUrls: ['./entity-select-remove.component.scss']
})
export class EntitySelectRemoveComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onEntityRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupModel: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  spinnerStatus = false;
  constructor(private entitySelectService: EntitySelectService) { }

  ngOnInit() {
  }

  show(selectedGroup: AdvEntitySelectableGroupModel) {
    this.selectedGroupModel = selectedGroup;
    this.frame.show();
  }

  deleteSelectedAdvEntitySelectableGroup() {
    this.spinnerStatus = true;
    this.entitySelectService.deleteEntitySelectableGroup(this.selectedGroupModel.entityGroupMUId).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.onEntityRemoved.emit();
      } this.spinnerStatus = false;
    });
  }

}
