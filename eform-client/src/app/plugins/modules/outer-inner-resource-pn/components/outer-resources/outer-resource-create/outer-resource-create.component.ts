import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OuterResourcePnCreateModel, InnerResourcesPnModel} from '../../../models';
import {OuterInnerResourcePnOuterResourceService} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-area-create',
  templateUrl: './outer-resource-create.component.html',
  styleUrls: ['./outer-resource-create.component.scss']
})
export class OuterResourceCreateComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Input() mappingMachines: InnerResourcesPnModel = new InnerResourcesPnModel();
  @Output() onAreaCreated: EventEmitter<void> = new EventEmitter<void>();
  newAreaModel: OuterResourcePnCreateModel = new OuterResourcePnCreateModel();

  constructor(private machineAreaPnAreasService: OuterInnerResourcePnOuterResourceService) { }

  ngOnInit() {
  }
// tslint:disable-next-line:comment-format
//Hej med dig
  show() {
    this.frame.show();
  }

  createArea() {
    this.machineAreaPnAreasService.createArea(this.newAreaModel).subscribe((data) => {
      if (data && data.success) {
        this.onAreaCreated.emit();
        this.newAreaModel = new OuterResourcePnCreateModel();
        this.frame.hide();
      }
    });
  }

  addToArray(e: any, machineId: number) {
    if (e.target.checked) {
      this.newAreaModel.relatedInnerResourcesIds.push(machineId);
    } else {
      this.newAreaModel.relatedInnerResourcesIds = this.newAreaModel.relatedInnerResourcesIds.filter(x => x !== machineId);
    }
  }

  isChecked(relatedMachineId: number) {
    return this.newAreaModel.relatedInnerResourcesIds.indexOf(relatedMachineId) !== -1;
  }
}

