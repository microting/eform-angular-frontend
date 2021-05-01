import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  OuterResourcesPnModel,
  InnerResourcePnModel,
  InnerResourcePnUpdateModel
} from '../../../models';
import {
  OuterInnerResourcePnInnerResourceService
} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-machine-edit',
  templateUrl: './inner-resource-edit.component.html',
  styleUrls: ['./inner-resource-edit.component.scss']
})
export class InnerResourceEditComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Input() mappingAreas: OuterResourcesPnModel = new OuterResourcesPnModel();
  @Output() onMachineUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedMachineModel: InnerResourcePnModel = new InnerResourcePnModel();
  constructor(private machineAreaPnMachinesService: OuterInnerResourcePnInnerResourceService) { }

  ngOnInit() {
  }

  show(machineModel: InnerResourcePnModel) {
    this.getSelectedMachine(machineModel.id);
    this.frame.show();
  }

  getSelectedMachine(id: number) {
    this.machineAreaPnMachinesService.getSingleMachine(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedMachineModel = data.model;
      }
    });
  }

  updateMachine() {
    this.machineAreaPnMachinesService.updateMachine(new InnerResourcePnUpdateModel(this.selectedMachineModel))
      .subscribe((data) => {
      if (data && data.success) {
        this.onMachineUpdated.emit();
        this.selectedMachineModel = new InnerResourcePnModel();
        this.frame.hide();
      }
    });
  }

  addToEditMapping(e: any, areaId: number) {
    if (e.target.checked) {
      this.selectedMachineModel.relatedOuterResourcesIds.push(areaId);
    } else {
      this.selectedMachineModel.relatedOuterResourcesIds = this.selectedMachineModel.relatedOuterResourcesIds.filter(x => x !== areaId);
    }
  }

  isChecked(areaId: number) {
    if (this.selectedMachineModel.relatedOuterResourcesIds && this.selectedMachineModel.relatedOuterResourcesIds.length > 0) {
      return this.selectedMachineModel.relatedOuterResourcesIds.findIndex(x => x === areaId) !== -1;
    } return false;
  }

}
