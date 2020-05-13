import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySearchableGroupModel} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-entity-search-remove',
  templateUrl: './entity-search-remove.component.html',
  styleUrls: ['./entity-search-remove.component.scss']
})
export class EntitySearchRemoveComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() onEntityRemoved: EventEmitter<void> = new EventEmitter<void>();
  selectedGroupModel: AdvEntitySearchableGroupModel = new AdvEntitySearchableGroupModel();
  constructor(private entitySearchService: EntitySearchService) { }

  ngOnInit() {
  }

  show(selectedGroup: AdvEntitySearchableGroupModel) {
    this.selectedGroupModel = selectedGroup;
    this.frame.show();
  }

  deleteSelectedAdvEntitySearchableGroup() {
    this.entitySearchService.deleteEntitySearchableGroup(this.selectedGroupModel.microtingUUID).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.onEntityRemoved.emit();
      }
    });
  }

}
