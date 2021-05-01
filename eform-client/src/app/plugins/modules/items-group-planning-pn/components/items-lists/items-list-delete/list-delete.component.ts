import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  ItemsGroupPlanningPnListsService
} from 'src/app/plugins/modules/items-group-planning-pn/services';
import {ItemsListPnModel} from '../../../models/list';

@Component({
  selector: 'app-items-group-planning-pn-list-delete',
  templateUrl: './list-delete.component.html',
  styleUrls: ['./list-delete.component.scss']
})
export class ListDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onListDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedListModel: ItemsListPnModel = new ItemsListPnModel();
  constructor(private itemsGroupPlanningPnListsService: ItemsGroupPlanningPnListsService) { }

  ngOnInit() {
  }

  show(listModel: ItemsListPnModel) {
    this.selectedListModel = listModel;
    this.frame.show();
  }

  deleteList() {
    this.itemsGroupPlanningPnListsService.deleteList(this.selectedListModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onListDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
