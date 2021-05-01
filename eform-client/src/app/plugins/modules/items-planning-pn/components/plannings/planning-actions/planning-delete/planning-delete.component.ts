import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  ItemsPlanningPnPlanningsService
} from 'src/app/plugins/modules/items-planning-pn/services';
import {PlanningModel} from '../../../../models/plannings';

@Component({
  selector: 'app-planning-delete',
  templateUrl: './planning-delete.component.html',
  styleUrls: ['./planning-delete.component.scss']
})
export class PlanningDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() planningDeleted: EventEmitter<void> = new EventEmitter<void>();
  planningModel: PlanningModel = new PlanningModel();
  constructor(private itemsPlanningPnPlanningsService: ItemsPlanningPnPlanningsService) { }

  ngOnInit() {
  }

  show(planningModel: PlanningModel) {
    this.planningModel = planningModel;
    this.frame.show();
  }

  deletePlanning() {
    this.itemsPlanningPnPlanningsService.deletePlanning(this.planningModel.id).subscribe((data) => {
      if (data && data.success) {
        this.planningDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
