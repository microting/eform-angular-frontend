import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteNameDto, TemplateDto} from 'src/app/common/models/dto';
import {DeployCheckbox, DeployModel} from 'src/app/common/models/eforms';
import {SitesService} from 'src/app/common/services/advanced';
import {EFormService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-edit-paring-modal',
  templateUrl: './eform-edit-paring-modal.component.html',
  styleUrls: ['./eform-edit-paring-modal.component.scss']
})
export class EformEditParingModalComponent implements OnInit {

  @ViewChild('frame') frame;
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  selectedTemplateDto: TemplateDto = new TemplateDto();
  sitesDto: Array<SiteNameDto> = [];
  spinnerStatus = false;
  matchFound = false;

  constructor(private eFormService: EFormService, private sitesService: SitesService) {
  }

  ngOnInit() {
    this.loadAllSites();
  }

  loadAllSites() {
    this.sitesService.getAllSites().subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  show(templateDto: TemplateDto) {
    this.selectedTemplateDto = templateDto;
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.fillCheckboxes();
    this.frame.show();
  }

  addToArray(e: any, deployId: number) {
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    debugger;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.deployModel.deployCheckboxes.push(deployObject);
    } else {
      this.deployModel.deployCheckboxes = this.deployModel.deployCheckboxes.filter(x => x.id != deployId);
    }
  }

  fillCheckboxes() {
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
      this.deployViewModel.id = this.selectedTemplateDto.id;
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound == true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }

  submitDeployment() {
    this.spinnerStatus = true;
    this.deployModel.id = this.selectedTemplateDto.id;
    this.eFormService.deploySingle(this.deployModel).subscribe(operation => {
      if (operation && operation.success) {
        this.frame.hide();
        this.onDeploymentFinished.emit();
      }
      this.spinnerStatus = false;
    });
  }
}
