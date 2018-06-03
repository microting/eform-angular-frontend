import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Router} from '@angular/router';
import {SiteDto, WorkerDto, WorkerCreateModel} from 'app/models';
import {WorkersService, NotifyService, SimpleSitesService} from 'app/services';
import {OperationDataResult} from 'app/modules/helpers/operation.models';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {
  @ViewChild('deleteWorkerModal')
  deleteWorkerModal: ModalComponent;
  @ViewChild('createWorkerModal')
  createWorkerModal: ModalComponent;
  spinnerStatus = true;
  selectedWorkerDto: WorkerDto = new WorkerDto();
  newWorkerModel: WorkerCreateModel = new WorkerCreateModel;
  simpleSites: Array<SiteDto> = [];
  workersDto: Array<WorkerDto>;

  constructor(private workersService: WorkersService,
              private router: Router,
              private notifyService: NotifyService,
              private simpleSitesService: SimpleSitesService) {
    this.workersDto = [];
  }

  ngOnInit() {
    this.loadAllWorkers();
    this.loadAllSimpleSites();
  }

  loadAllWorkers() {
    this.workersService.getAllWorkers().subscribe(this.onAllWorkersLoaded.bind(this));
  }

  loadAllSimpleSites() {
    this.simpleSitesService.getAllSimpleSites().subscribe((data => {
      this.simpleSites = data.model;
    }));
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
    this.deleteWorkerModal.open().then();
  }

  showCreateWorkerModal() {
    this.createWorkerModal.open().then();
  }

  submitDeleteWorkerModal(id: number) {
    this.deleteSingle(id);
  }

  createWorker() {
    this.workersService.createWorker(this.newWorkerModel).subscribe((data => {
      if (data && data.success) {
        this.notifyService.success({text: data.message});
        this.newWorkerModel = new WorkerCreateModel;
        this.loadAllWorkers();
      } else {
        this.notifyService.success({text: data.message});
      }
    }));
  }

  selectSiteForWorker(e: any) {
    if (e.target.value != 'null') {
      let foundSiteDto = this.simpleSites.find(x => x.siteId === +e.target.value);
      this.newWorkerModel.siteId = foundSiteDto.siteId;
      this.newWorkerModel.customerNo = foundSiteDto.customerNo;
    } else {
      this.newWorkerModel.siteId = null;
    }

  }
}
