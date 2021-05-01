import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProducerPnModel } from '../../../models/producer';
import { TrashInspectionPnProducersService } from '../../../services';
import { EFormService } from '../../../../../../common/services/eform';

@Component({
  selector: 'app-trash-inspection-pn-producer-create',
  templateUrl: './producer-create.component.html',
  styleUrls: ['./producer-create.component.scss'],
})
export class ProducerCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onProducerCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  newProducerModel: ProducerPnModel = new ProducerPnModel();
  typeAhead = new EventEmitter<string>();
  constructor(
    private trashInspectionPnProducerService: TrashInspectionPnProducersService,
    private eFormService: EFormService
  ) {}

  ngOnInit() {}

  createProducer() {
    this.trashInspectionPnProducerService
      .createProducer(this.newProducerModel)
      .subscribe((data) => {
        // debugger;
        if (data && data.success) {
          this.onProducerCreated.emit();
          // this.submitDeployment();
          this.newProducerModel = new ProducerPnModel();
          this.frame.hide();
        }
      });
  }

  show() {
    this.frame.show();
  }
}
