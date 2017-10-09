import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkerDto} from 'app/models/dto';
import {WorkerModel} from 'app/models/advanced';
import {WorkersService, NotifyService} from 'app/services';

@Component({
  selector: 'app-worker-edit',
  templateUrl: './worker-edit.component.html',
  styleUrls: ['./worker-edit.component.css']
})
export class WorkerEditComponent implements OnInit {
  id: number;
  workerDto: WorkerDto = new WorkerDto();
  workerModel: WorkerModel = new WorkerModel();
  spinnerStatus: boolean;

  constructor(private workersService: WorkersService, private activateRoute: ActivatedRoute,
              private router: Router, private notifyService: NotifyService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.getSingle();
  }

  updateSingle() {
    this.spinnerStatus = true;
    this.workerModel.id = this.id;
    this.workersService.updateSingleWorker(this.workerModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/advanced/workers/']);
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.spinnerStatus = false;
    });
  }

  getSingle() {
    this.workersService.getSingleWorker(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.workerDto = operation.model;

        this.workerModel.userFirstName = this.workerDto.firstName;
        this.workerModel.userLastName = this.workerDto.lastName;
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }
}
