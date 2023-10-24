import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {FolderDto, SiteNameDto, TemplateDto, DeployCheckbox, DeployModel} from 'src/app/common/models';
import {FoldersService, SitesService, EFormService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {Store} from "@ngrx/store";
import {selectCurrentUserClaimsEformsPairingRead} from 'src/app/state/auth/auth.selector';

@Component({
  selector: 'app-eform-edit-paring-modal',
  templateUrl: './eform-edit-paring-modal.component.html',
  styleUrls: ['./eform-edit-paring-modal.component.scss'],
})
export class EformEditParingModalComponent implements OnInit {
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  sitesDto: Array<SiteNameDto> = [];
  matchFound = false;
  foldersDto: Array<FolderDto> = [];
  saveButtonDisabled = true;
  eformDeployed = false;
  // tableHeaders: MtxGridColumn[] = [
  //   { header: this.translateService.stream('Microting ID'), field: 'siteUId', },
  //   { header: this.translateService.stream('Device user'), field: 'siteName', },
  //   // { header: this.translateService.get('Select'), field: 'status' },
  // ];
  rowSelected: any[];
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  constructor(
    private authStore: Store,
    private foldersService: FoldersService,
    private eFormService: EFormService,
    private sitesService: SitesService,
    private authStateService: AuthStateService,
    public dialogRef: MatDialogRef<EformEditParingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedTemplateDto: TemplateDto = new TemplateDto(),
    public translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loadAllSites();
    this.saveButtonDisabled = true;
    this.eformDeployed = this.selectedTemplateDto.deployedSites.length > 0;
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
  }

  loadAllSites() {
    this.selectCurrentUserClaimsEformsPairingRead$.subscribe((x) => {
      if (x) {
        this.sitesService.getAllSitesForPairing().subscribe((operation) => {
          if (operation && operation.success) {
            this.sitesDto = operation.model;
            this.loadAllFolders();
          }
        });
      }
    });
    // if (this.userClaims.eformsPairingRead) {
    //   this.sitesService.getAllSitesForPairing().subscribe((operation) => {
    //     if (operation && operation.success) {
    //       this.sitesDto = operation.model;
    //       this.loadAllFolders();
    //     }
    //   });
    // }
  }

  addToArray(e: any, deployId: number) {
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    if (e.checked) {
      deployObject.isChecked = true;
      this.deployModel.deployCheckboxes.push(deployObject);
    } else {
      this.deployModel.deployCheckboxes = this.deployModel.deployCheckboxes.filter(
        (x) => x.id !== deployId
      );
    }
  }

  fillCheckboxes() {
    // for (const siteDto of this.sitesDto) {
    //   // @ts-ignore
    //   siteDto.status = !(this.selectedTemplateDto.deployedSites.findIndex(x => x.siteUId === siteDto.siteUId) === -1);
    // }
    // // @ts-ignore
    // this.rowSelected = this.sitesDto.filter(x => x.status);
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      for (const deployedSite of this.selectedTemplateDto.deployedSites) {
        if (deployedSite.siteUId === siteDto.siteUId) {
          this.matchFound = true;
          deployObject.id = siteDto.siteUId;
          deployObject.isChecked = true;
          this.deployModel.deployCheckboxes.push(deployObject);
        }
      }
      this.deployModel.folderId = this.selectedTemplateDto.folderId;
      this.deployViewModel.id = this.selectedTemplateDto.id;
      if (
        this.foldersDto.length === 0 ||
        (this.foldersDto.length > 0 && this.deployModel.folderId)
      ) {
        this.saveButtonDisabled = false;
      }
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound === true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }

  submitDeployment() {
    this.deployModel.id = this.selectedTemplateDto.id;
    this.eFormService.deploySingle(this.deployModel).subscribe((operation) => {
      if (operation && operation.success) {
        this.deployModel = new DeployModel();
        this.hide(true);
        // this.frame.hide();
        // this.deploymentFinished.emit();
      }
    });
    // this.deployModel.id = this.selectedTemplateDto.id;
    // this.deployModel.deployCheckboxes = this.rowSelected
    //   .map(x => {
    //   return { id: x.siteUId, isChecked: true};
    // });
    // this.eFormService.deploySingle(this.deployModel).subscribe((operation) => {
    //   if (operation && operation.success) {
    //     this.deployModel = new DeployModel();
    //     this.hide(true);
    //   }
    // });
  }

  loadAllFolders() {
    this.foldersService.getAllFolders().subscribe((operation) => {
      if (operation && operation.success) {
        this.foldersDto = operation.model;
        this.fillCheckboxes();
        this.deployModel.folderId = this.selectedTemplateDto.folderId;
      }
    });
  }

  folderSelected(folder: FolderDto) {
    this.deployModel.folderId = folder ? folder.id : null;
    if (this.deployModel.folderId != null) {
      this.saveButtonDisabled = false;
    }
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
