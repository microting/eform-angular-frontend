import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Router} from '@angular/router';
import {WorkerDto} from 'app/models/dto';
import {WorkersService, NotifyService} from 'app/services';
import {OperationDataResult} from 'app/modules/helpers/operation.models';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {
  @ViewChild('deleteWorkerModal')
  deleteWorkerModal: ModalComponent;
  spinnerStatus = true;
  selectedWorkerDto: WorkerDto = new WorkerDto();
  workersDto: Array<WorkerDto>;

  constructor(private workersService: WorkersService, private router: Router, private notifyService: NotifyService) {
    this.workersDto = [];
  }

  ngOnInit() {
    this.loadAllWorkers();
  }

  loadAllWorkers() {
    this.workersService.getAllWorkers().subscribe(this.onAllWorkersLoaded.bind(this));
  }

  onAllWorkersLoaded(operation: OperationDataResult<Array<WorkerDto>>) {
    this.spinnerStatus = true;
    if (operation && operation.success) {
      this.workersDto = operation.model;
    }
    this.spinnerStatus = false;
  }

  deleteSingle(id: number) {
    this.workersService.deleteSingleWorker(id).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/advanced/workers/']);
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.deleteWorkerModal.close();
    });
  }

  showDeleteWorkerModal(workerDto: WorkerDto) {
    this.selectedWorkerDto = workerDto;
    this.deleteWorkerModal.open();
  }

  submitDeleteWorkerModal(id: number) {
    this.deleteSingle(id);
  }

}
