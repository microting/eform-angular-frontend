import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ItemsGroupPlanningPnUploadedDataService} from '../../../services';
import {UploadedDataModel} from '../../../models/list';

@Component({
  selector: 'app-uploaded-data-delete',
  templateUrl: './uploaded-data-delete.component.html',
  styleUrls: ['./uploaded-data-delete.component.scss']
})
export class UploadedDataDeleteComponent implements OnInit {
 @ViewChild('frame', {static: false}) frame;
 @Output() onUploadedDataDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedUploadedData: UploadedDataModel = new UploadedDataModel();
  constructor(private itemsPlanningPnUploadedDataService: ItemsGroupPlanningPnUploadedDataService) { }

  ngOnInit() {
  }

  show(uploadedData: UploadedDataModel) {
    this.selectedUploadedData = uploadedData;
    this.frame.show();
  }

  deleteUploadedData() {
    this.itemsPlanningPnUploadedDataService.deleteUploadedData(this.selectedUploadedData.id).subscribe((data) => {
      if (data && data.success) {
        this.onUploadedDataDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
