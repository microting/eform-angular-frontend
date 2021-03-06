import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WorkerDto} from 'src/app/common/models/dto';
import {WorkersService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-worker-delete',
  templateUrl: './worker-delete.component.html',
  styleUrls: ['./worker-delete.component.scss']
})
export class WorkerDeleteComponent implements OnInit {
  @Input() selectedWorkerDto: WorkerDto = new WorkerDto();
  @Output() onWorkerDeleted: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('frame', { static: true }) frame;

  constructor(private workersService: WorkersService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  deleteWorker() {
    this.workersService.deleteSingleWorker(this.selectedWorkerDto.workerUId).subscribe(operation => {
      if (operation && operation.success) {
        this.frame.hide();
        this.onWorkerDeleted.emit();
      }
    });
  }

}
