import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TransporterPnModel } from '../../../models/transporter';
import { TrashInspectionPnTransporterService } from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-transporter-create',
  templateUrl: './transporter-create.component.html',
  styleUrls: ['./transporter-create.component.scss'],
})
export class TransporterCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onTransporterCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  newTransporterModel: TransporterPnModel = new TransporterPnModel();
  constructor(
    private trashInspectionPnTransporterService: TrashInspectionPnTransporterService
  ) {}

  ngOnInit() {}
  createTransporter() {
    this.trashInspectionPnTransporterService
      .createTransporter(this.newTransporterModel)
      .subscribe((data) => {
        // debugger;
        if (data && data.success) {
          this.onTransporterCreated.emit();
          // this.submitDeployment();
          this.newTransporterModel = new TransporterPnModel();
          this.frame.hide();
        }
      });
  }

  show() {
    this.frame.show();
  }
}
