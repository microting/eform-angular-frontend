import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TrashInspectionPnFractionsService } from 'src/app/plugins/modules/trash-inspection-pn/services';
import { FractionPnModel } from '../../../models/fraction';

@Component({
  selector: 'app-trash-inspection-pn-fraction-delete',
  templateUrl: './fraction-delete.component.html',
  styleUrls: ['./fraction-delete.component.scss'],
})
export class FractionDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  constructor(
    private trashInspectionPnFractionsService: TrashInspectionPnFractionsService
  ) {}

  ngOnInit() {}

  show(fractionModel: FractionPnModel) {
    this.selectedFractionModel = fractionModel;
    this.frame.show();
  }

  deleteFraction() {
    this.trashInspectionPnFractionsService
      .deleteFraction(this.selectedFractionModel.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.onFractionDeleted.emit();
          this.frame.hide();
        }
      });
  }
}
