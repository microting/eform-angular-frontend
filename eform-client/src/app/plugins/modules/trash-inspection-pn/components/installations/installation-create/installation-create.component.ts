import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InstallationPnCreateModel } from '../../../models';
import { TrashInspectionPnInstallationsService } from '../../../services';
import { SiteNameDto } from 'src/app/common/models';
import {
  DeployCheckbox,
  DeployModel,
} from '../../../../../../common/models/eforms';
import { EFormService } from 'src/app/common/services/eform';
import { AuthService, SitesService } from 'src/app/common/services';

@Component({
  selector: 'app-trash-inspection-pn-installation-create',
  templateUrl: './installation-create.component.html',
  styleUrls: ['./installation-create.component.scss'],
})
export class InstallationCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output()
  onInstallationCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  newInstallationModel: InstallationPnCreateModel = new InstallationPnCreateModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  matchFound = false;

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(
    private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
    private sitesService: SitesService,
    private authService: AuthService,
    private eFormService: EFormService
  ) {}

  ngOnInit() {
    this.loadAllSites();
  }

  createInstallation() {
    this.trashInspectionPnInstallationsService
      .createInstallation(this.newInstallationModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onInstallationCreated.emit();
          // this.submitDeployment();
          this.newInstallationModel = new InstallationPnCreateModel();
          this.frame.hide();
        }
      });
  }

  loadAllSites() {
    if (this.userClaims.eformsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
  }

  show() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.fillCheckboxes();
    this.frame.show();
  }

  addToArray(e: any, deployId: number) {
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.newInstallationModel.deployCheckboxes.push(deployObject);
    } else {
      this.newInstallationModel.deployCheckboxes = this.newInstallationModel.deployCheckboxes.filter(
        (x) => x.id !== deployId
      );
    }
  }

  fillCheckboxes() {
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      // for (const deployedSite of this.newInstallationModel.deployedSites) {
      //   if (deployedSite.siteUId === siteDto.siteUId) {
      //     this.matchFound = true;
      //     deployObject.id = siteDto.siteUId;
      //     deployObject.isChecked = true;
      //     this.deployModel.deployCheckboxes.push(deployObject);
      //   }
      // }
      this.deployViewModel.id = this.newInstallationModel.id;
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound === true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }
}
