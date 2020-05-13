import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableGroupModel} from 'src/app/common/models/advanced';
import {EntitySelectService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-entity-select-remove',
  templateUrl: './entity-select-remove.component.html',
  styleUrls: ['./entity-select-remove.component.scss']
})
export class EntitySelectRemoveComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onEntityRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupModel: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  constructor(private entitySelectService: EntitySelectService) { }

  ngOnInit() {
  }

  show(selectedGroup: AdvEntitySelectableGroupModel) {
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
