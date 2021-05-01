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
  selector: 'app-trash-inspection-pn-segment-delete',
  templateUrl: './segment-delete.component.html',
  styleUrls: ['./segment-delete.component.scss'],
})
export class SegmentDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onSegmentDeleted: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  constructor(
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService
  ) {}

  ngOnInit() {}

  show(segmentPnModel: SegmentPnModel) {
    this.segmentPnModel = segmentPnModel;
    this.frame.show();
  }

  deleteSegment() {
    this.trashInspectionPnSegmentsService
      .deleteSegment(this.segmentPnModel.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.onSegmentDeleted.emit();
          this.frame.hide();
        }
      });
  }
}
