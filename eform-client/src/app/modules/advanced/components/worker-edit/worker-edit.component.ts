import {Component, OnInit} from '@angular/core';
import {WorkerDto} from '../../../../models/dto/worker.dto';
import {WorkersService} from '../../../../services/workers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkerModel} from '../../../../models/advanced/worker.model';
import {NotifyService} from '../../../helpers/helpers.module';

@Component({
  selector: 'app-worker-edit',
  templateUrl: './worker-edit.component.html',
  styleUrls: ['./worker-edit.component.css']
})
export class WorkerEditComponent implements OnInit {
  id: number;
  workerDto: WorkerDto = new WorkerDto();
  workerModel: WorkerModel = new WorkerModel();

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
    this.workerModel.id = this.id;
    this.workersService.updateSingleWorker(this.workerModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/advanced/workers/']);
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

  getSingle() {
    this.workersService.getSingleWorker(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.workerDto = operation.model;

        this.workerModel.userFirstName = this.workerDto.firstName;
        this.workerModel.userLastName = this.workerDto.lastName;
      }
    });
  }
}
