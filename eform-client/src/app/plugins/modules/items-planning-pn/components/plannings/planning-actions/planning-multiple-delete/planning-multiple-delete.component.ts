import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PlanningModel } from '../../../../models/plannings';

@Component({
  selector: 'app-planning-multiple-delete',
  templateUrl: './planning-multiple-delete.component.html',
  styleUrls: ['./planning-multiple-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanningMultipleDeleteComponent implements OnInit {
  @ViewChild('frame', { static: false }) frame;
  @Output()
  deleteMultiplePlannings: EventEmitter<void> = new EventEmitter<void>();
  planningModel: PlanningModel = new PlanningModel();
  selectedPlanningsCount: number;

  constructor() {}

  ngOnInit() {}

  show(selectedPlanningsCount: number) {
    this.selectedPlanningsCount = selectedPlanningsCount;
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  onDeleteMultiplePlannings() {
    this.deleteMultiplePlannings.emit();
  }
}
