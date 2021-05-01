import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {OuterResourcePnModel, OuterResourcePnUpdateModel} from '../../../models/area';
import {InnerResourcePnModel, InnerResourcesPnModel} from '../../../models/machine';
import {OuterInnerResourcePnOuterResourceService} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-area-edit',
  templateUrl: './outer-resource-edit.component.html',
  styleUrls: ['./outer-resource-edit.component.scss']
})
export class OuterResourceEditComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Input() mappingMachines: InnerResourcesPnModel = new InnerResourcesPnModel();
  @Output() onAreaUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedAreaModel: OuterResourcePnModel = new OuterResourcePnModel();
  constructor(private machineAreaPnAreasService: OuterInnerResourcePnOuterResourceService) { }

  ngOnInit() {
  }

  show(areaModel: OuterResourcePnModel) {
    this.getSelectedArea(areaModel.id);
    this.frame.show();
  }

  getSelectedArea(id: number) {
    this.machineAreaPnAreasService.getSingleArea(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedAreaModel = data.model;
      }
    });
  }

  updateArea() {
    this.machineAreaPnAreasService.updateArea(new OuterResourcePnUpdateModel(this.selectedAreaModel)).subscribe((data) => {
      if (data && data.success) {
        this.onAreaUpdated.emit();
        this.selectedAreaModel = new OuterResourcePnModel();
        this.frame.hide();
      }
    });
  }

  addToEditMapping(e: any, machineId: number) {
    if (e.target.checked) {
      this.selectedAreaModel.relatedInnerResourcesIds.push(machineId);
    } else {
      this.selectedAreaModel.relatedInnerResourcesIds = this.selectedAreaModel.relatedInnerResourcesIds.filter(x => x !== machineId);
    }
  }

  isChecked(machineId: number) {
    if (this.selectedAreaModel.relatedInnerResourcesIds && this.selectedAreaModel.relatedInnerResourcesIds.length > 0) {
      return this.selectedAreaModel.relatedInnerResourcesIds.findIndex(x => x === machineId) !== -1;
    } return false;
  }
}
