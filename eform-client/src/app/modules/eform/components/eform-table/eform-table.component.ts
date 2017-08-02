import {Component, OnInit, ViewChild} from '@angular/core';
import {EFormService, SitesService} from 'app/services';
import {SiteNameDto, TemplateDto} from 'app/models';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from '../../../../services/notify.service';
import {EFormXmlModel} from '../../../../models/eFormTemplates/eform-xml.model';
import {DeployModel} from '../../../../models/eFormTemplates/deploy.model';
import {DeployCheckbox} from '../../../../models/eFormTemplates/deploy-checkbox.model';

@Component({
  selector: 'app-eform-table',
  templateUrl: './eform-table.component.html',
  styleUrls: ['./eform-table.component.css']
})
export class EFormTableComponent implements OnInit {
  @ViewChild('deploymentModal')
  deploymentModal: ModalComponent;
  @ViewChild('deleteTemplateModal')
  deleteTemplateModal: ModalComponent;
  @ViewChild('createTemplateModal')
  createTemplateModal: ModalComponent;
  spinnerStatus = true;
  matchFound = false;
  eFormXmlModel: EFormXmlModel = new EFormXmlModel();
  templatesDto: Array<TemplateDto> = [];
  selectedTemplateDto: TemplateDto = new TemplateDto();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  deploymentModalTitle: String = 'Edit deployment';
  isDeploying = false;

  constructor(private eFormService: EFormService, private notifyService: NotifyService, private sitesService: SitesService) {
  }

  ngOnInit() {
    this.loadAllTemplates();
  }

  loadAllTemplates() {
    this.spinnerStatus = true;
    this.eFormService.getAll().subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.templatesDto = operation.model;
      }
    });
  }

  loadAllSites() {
    this.sitesService.getAllSites().subscribe(operation => {
      this.spinnerStatus = true;
      if (operation && operation.success) {
        this.sitesDto = operation.model;
        this.fillCheckboxes();
      }
      this.spinnerStatus = false;
    });
  }

  // Delete modal
  deleteSingle(id: number) {
    this.eFormService.deleteSingle(id).subscribe(operation => {
      if (operation && operation.success) {
        this.loadAllTemplates();
        this.notifyService.success({text: operation.message || 'Error'});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.deleteTemplateModal.close();
    });
  }

  showTemplateDeleteModal(templateDto: TemplateDto) {
    this.selectedTemplateDto = templateDto;
    this.deleteTemplateModal.open();
  }

  submitTemplateDeleteModal(id: number) {
    this.deleteSingle(id);
  }

  // Create modal
  createSingleTemplate() {
    if (this.eFormXmlModel != null) {
      this.eFormService.createSingle(this.eFormXmlModel).subscribe(operation => {
        if (operation && operation.success) {
          this.loadAllTemplates();
          this.notifyService.success({text: operation.message || 'Error'});
        } else {
          this.notifyService.error({text: operation.message || 'Error'});
        }
        this.createTemplateModal.close();
      });
    }
  }

  showTemplateCreateModal() {
    this.createTemplateModal.open();
  }

  submitTemplateCreateModal() {
    this.createSingleTemplate();
  }

  // Deployment modal
  private getInfoForModal(id: number) {
    this.deployViewModel.deployCheckboxes = [];
    this.selectedTemplateDto.id = id;
    this.deployModel.id = id;
    this.loadAllTemplates();
    this.loadAllSites();
    this.deploymentModal.open();
  }

  editDeployment(id: number) {
    if (id <= 0) {
      return;
    }
    this.deploymentModalTitle = 'Edit deployment';
    this.getInfoForModal(id);
  }

  selectWorkers(id: number) {
    if (id <= 0) {
      return;
    }
    this.deploymentModalTitle = 'New deployment';
    this.getInfoForModal(id);
  }

  fillCheckboxes() {
    this.deployModel.deployCheckboxes = [];
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      var currentTemplate = this.templatesDto.filter(x => x.id == this.deployModel.id);
      for (const templateDto of currentTemplate) {
        for (const deployedSite of templateDto.deployedSites) {
          if (deployedSite.siteUId === siteDto.siteUId) {
            this.matchFound = true;
            deployObject.id = siteDto.siteUId;
            deployObject.isChecked = true;
            this.deployModel.deployCheckboxes.push(deployObject);
          }
        }
        this.deployViewModel.id = templateDto.id;
      }
      deployObject.id = siteDto.siteUId;
      if (this.matchFound == true) {
        deployObject.isChecked = true;
      } else {
        deployObject.isChecked = false;
      }
      this.matchFound = false;

      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }

  addToArray(e) {
    const deployObject = new DeployCheckbox();
    deployObject.id = e.target.value;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.deployModel.deployCheckboxes.push(deployObject);
    } else {
      this.deployModel.deployCheckboxes = this.deployModel.deployCheckboxes.filter(x => x.id != e.target.value);
    }
  }

  submitDeploymentModal() {
    if (this.deployModel.id != null) {
      this.isDeploying = true;
      this.eFormService.deploySingle(this.deployModel).subscribe(operation => {
        if (operation && operation.success) {
          this.loadAllTemplates();
          this.isDeploying = false;
          this.notifyService.success({text: operation.message || 'Error'});
        } else {
          this.isDeploying = false;
          this.notifyService.error({text: operation.message || 'Error'});
        }
        this.deploymentModal.close();
      });
    }
  }
}
