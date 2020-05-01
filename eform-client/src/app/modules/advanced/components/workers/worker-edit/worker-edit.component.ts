import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WorkerModel} from 'src/app/common/models/advanced';
import {WorkerDto} from 'src/app/common/models/dto';
import {WorkersService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-worker-edit',
  templateUrl: './worker-edit.component.html'
})
export class WorkerEditComponent implements OnInit {
  @Input() selectedWorkerDto: WorkerDto = new WorkerDto();
  @Output() onWorkerEdited: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;
  workerModel: WorkerModel = new WorkerModel();
  spinnerStatus = false;

  constructor(private workersService: WorkersService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  updateSingle() {
    this.workerModel.id = this.selectedWorkerDto.workerUId;
    this.workerModel.userFirstName = this.selectedWorkerDto.firstName;
    this.workerModel.userLastName = this.selectedWorkerDto.lastName;
    this.workersService.updateSingleWorker(this.workerModel).subscribe(operation => {
      if (operation && operation.success) {
        this.onWorkerEdited.emit();
        this.frame.hide();
      }
    });
  }
}
