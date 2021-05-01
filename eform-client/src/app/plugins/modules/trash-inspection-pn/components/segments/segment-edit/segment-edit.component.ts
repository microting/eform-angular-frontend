import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TrashInspectionPnSegmentsService } from '../../../services/trash-inspection-pn-segments.service';
import { SegmentPnModel } from '../../../models/segment';

@Component({
  selector: 'app-trash-inspection-pn-segment-edit',
  templateUrl: './segment-edit.component.html',
  styleUrls: ['./segment-edit.component.scss'],
})
export class SegmentEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onSegmentUpdated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  typeahead = new EventEmitter<string>();
  constructor(
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService
  ) {}

  ngOnInit() {}

  show(segmentPnModel: SegmentPnModel) {
    this.getSelectedFraction(segmentPnModel.id);
    this.frame.show();
  }

  getSelectedFraction(id: number) {
    this.trashInspectionPnSegmentsService
      .getSingleSegment(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.segmentPnModel = data.model;
        }
      });
  }

  updateFraction() {
    this.trashInspectionPnSegmentsService
      .updateSegment(this.segmentPnModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onSegmentUpdated.emit();
          this.segmentPnModel = new SegmentPnModel();
          this.frame.hide();
        }
      });
  }

  onSelectedChanged(e: any) {}
}
