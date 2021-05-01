import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InnerResourcePnModel} from '../../../models';
import {OuterInnerResourcePnInnerResourceService} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-machine-delete',
  templateUrl: './inner-resource-delete.component.html',
  styleUrls: ['./inner-resource-delete.component.scss']
})
export class InnerResourceDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onMachineDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedMachineModel: InnerResourcePnModel = new InnerResourcePnModel();
  constructor(private machineAreaPnMachinesService: OuterInnerResourcePnInnerResourceService) { }

  ngOnInit() {
  }

  show(machineModel: InnerResourcePnModel) {
    this.selectedMachineModel = machineModel;
    this.frame.show();
  }

  deleteMachine() {
    this.machineAreaPnMachinesService.deleteMachine(this.selectedMachineModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onMachineDeleted.emit();
        this.selectedMachineModel = new InnerResourcePnModel();
        this.frame.hide();
      }
    });
  }

}
