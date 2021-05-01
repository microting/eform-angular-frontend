import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  InstallationPnModel,
  InstallationPnUpdateModel,
} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import { TrashInspectionPnInstallationsService } from '../../../services';
import { AuthService, SitesService } from 'src/app/common/services';
import { SiteNameDto } from 'src/app/common/models';
import {
  DeployCheckbox,
  DeployModel,
} from '../../../../../../common/models/eforms';

@Component({
  selector: 'app-trash-inspection-pn-installation-edit',
  templateUrl: './installation-edit.component.html',
  styleUrls: ['./installation-edit.component.scss'],
})
export class InstallationEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output()
  onInstallationUpdated: EventEmitter<void> = new EventEmitter<void>();

  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  sitesDto: Array<SiteNameDto> = [];
  matchFound = false;
  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(
    private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
    private sitesService: SitesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAllSites();
    this.selectedInstallationModel.deployCheckboxes = new Array<DeployCheckbox>();
  }

  show(installationModel: InstallationPnModel) {
    this.getSelectedInstallation(installationModel.id);
    this.deployViewModel = new DeployModel();
    this.frame.show();
  }

  getSelectedInstallation(id: number) {
    // debugger;
    this.trashInspectionPnInstallationsService
      .getSingleInstallation(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedInstallationModel = data.model;
          this.fillCheckboxes();
        }
      });
  }

  updateInstallation() {
    // debugger;
    this.trashInspectionPnInstallationsService
      .updateInstallation(
        new InstallationPnUpdateModel(this.selectedInstallationModel)
      )
      .subscribe((data) => {
        if (data && data.success) {
          this.onInstallationUpdated.emit();
          this.selectedInstallationModel = new InstallationPnModel();
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

  addToEditMapping(e: any, sdkSiteId: number) {
    if (e.target.checked) {
      this.selectedInstallationModel.SdkSiteIds.push(sdkSiteId);
    } else {
      this.selectedInstallationModel.SdkSiteIds = this.selectedInstallationModel.SdkSiteIds.filter(
        (x) => x !== sdkSiteId
      );
    }
  }

  addToArray(e: any, deployId: number) {
    // debugger;
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.selectedInstallationModel.deployCheckboxes.push(deployObject);
    } else {
      this.selectedInstallationModel.deployCheckboxes = this.selectedInstallationModel.deployCheckboxes.filter(
        (x) => x.id !== deployId
      );
    }
  }

  // isChecked(sdkSiteId: number) {
  //   debugger;
  //   if (this.selectedInstallationModel.SdkSiteIds && this.selectedInstallationModel.SdkSiteIds.length > 0) {
  //     return this.selectedInstallationModel.SdkSiteIds.findIndex(x => x === sdkSiteId) !== -1;
  //   }
  //   return false;
  // }

  fillCheckboxes() {
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      for (const deployCheckboxes of this.selectedInstallationModel
        .deployCheckboxes) {
        if (deployCheckboxes.id === siteDto.siteUId) {
          this.matchFound = true;
          deployObject.id = siteDto.siteUId;
          deployObject.isChecked = true;
          this.deployModel.deployCheckboxes.push(deployObject);
        }
      }
      this.deployViewModel.id = this.selectedInstallationModel.id;
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound === true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }
}
