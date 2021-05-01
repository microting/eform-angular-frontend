import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {WorkOrderModel} from 'src/app/plugins/modules/workorders-pn/models';
import {WorkOrdersService} from 'src/app/plugins/modules/workorders-pn/services';

@Component({
  selector: 'app-workorders-delete',
  templateUrl: './workorders-delete.component.html',
  styleUrls: ['./workorders-delete.component.scss']
})
export class WorkOrdersDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() workOrderDeleted: EventEmitter<void> = new EventEmitter<void>();
  workOrderModel: WorkOrderModel = new WorkOrderModel();
  constructor(private workOrdersService: WorkOrdersService) { }

  ngOnInit() {
  }

  show(workOrderModel1: WorkOrderModel) {
    this.workOrderModel = workOrderModel1;
    this.frame.show();
  }

  deletePlanning() {
    this.workOrdersService.deleteWorkOrder(this.workOrderModel.id).subscribe((data) => {
      if (data && data.success) {
        this.workOrderDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
