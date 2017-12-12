import {Component, OnInit, ViewChild} from '@angular/core';
import {EFormService, SitesService, } from 'app/services';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NotifyService} from 'app/services/notify.service';
import {DeployCheckbox} from 'app/models/eFormTemplates/deploy-checkbox.model';
import {SiteNameDto, TemplateDto, TemplateColumnModel, UpdateColumnsModel, DeployModel, EFormXmlModel} from 'app/models';
import {FileUploader} from 'ng2-file-upload';
import {TemplateListModel} from 'app/models/eFormTemplates/template-list.model';
import {TemplateRequestModel} from 'app/models/eFormTemplates/template-request.model';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';

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
  @ViewChild('editCasesColumnsModal')
  editCasesColumnsModal: ModalComponent;
  @ViewChild('uploadTemplateZIPModal')
  uploadTemplateZIPModal: ModalComponent;

  spinnerStatus = true;
  matchFound = false;
  eFormXmlModel: EFormXmlModel = new EFormXmlModel();
  templateListModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  selectedTemplateDto: TemplateDto = new TemplateDto();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  deploymentModalTitle: String = 'Edit deployment';
  isDeploying = false;

  columnModels: Array<TemplateColumnModel> = [];
  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;

  zipFileUploader: FileUploader = new FileUploader({url: '/api/template-files/upload-eform-zip'});

  isTagAddOpen = false;
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 3,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
  };
  myTexts: IMultiSelectTexts = {
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select tags for template',
    allSelected: 'All selected',
  };


  constructor(private eFormService: EFormService, private notifyService: NotifyService, private sitesService: SitesService) {
  }


  ngOnInit() {
    this.myOptions = [
      { id: 1, name: 'Zhopa' },
      { id: 2, name: 'Gondolera' },
      { id: 3, name: 'Gondolera' },
      { id: 4, name: 'Gondolera' },
      { id: 5, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' },
      { id: 6, name: 'Gondolera' }
    ];

    this.loadAllTemplates();

    this.zipFileUploader.onBuildItemForm = (item, form) => {
      form.append('templateId', this.selectedTemplateDto.id);
    };
    this.zipFileUploader.onAfterAddingFile = f => {
      if (this.zipFileUploader.queue.length > 1) {
        this.zipFileUploader.removeFromQueue(this.zipFileUploader.queue[0]);
      }
    };
  }

  loadAllTemplates() {
    this.spinnerStatus = true;
    this.eFormService.getAll(this.templateRequestModel).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.templateListModel = operation.model;
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
          this.eFormXmlModel = new EFormXmlModel;
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

  editDeployment(model: TemplateDto) {
    if (model.id <= 0) {
      return;
    }
    this.deploymentModalTitle = model.label;
    this.getInfoForModal(model.id);
  }

  fillCheckboxes() {
    this.deployModel.deployCheckboxes = [];
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      const currentTemplate = this.templateListModel.templates.filter(x => x.id == this.deployModel.id);
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

  openEditCasesColumnsModal(templateDto: TemplateDto) {
    this.selectedTemplateDto = templateDto;
    this.eFormService.getTemplateColumns(templateDto.id).subscribe((operation) => {
      if (operation && operation.success) {
        this.columnModels = operation.model;

        this.eFormService.getCurrentTemplateColumns(templateDto.id).subscribe((result) => {
          if (result && result.success) {
            this.columnEditModel = result.model;
            this.editCasesColumnsModal.open();
          }
        });

      }
    });
  }

  updateColumns() {
    this.columnEditModel.templateId = this.selectedTemplateDto.id;
    this.eFormService.updateTemplateColumns(this.columnEditModel).subscribe((data => {
      if (data && data.success) {
        this.notifyService.success({text: 'Columns for template was successfully updated'});
      } else {
        this.notifyService.error({text: 'Error while updating columns for template'});
      }
      this.editCasesColumnsModal.dismiss().then();
    }));
  }

  downloadTemplateXML(id: number) {
    this.eFormService.downloadEformXML(id).subscribe((data => {

    }));
  }

  showUploadTemplateZIP(templateDto: TemplateDto) {
    this.selectedTemplateDto = templateDto;
    this.uploadTemplateZIPModal.open();
  }

  uploadTemplateZIP() {
    this.zipFileUploader.queue[0].upload();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.templateRequestModel.offset = e;
      if (e === 0) {
        this.templateRequestModel.pageIndex = 0;
      } else {
        this.templateRequestModel.pageIndex = Math.floor(e / this.templateRequestModel.pageSize);
      }
      this.loadAllTemplates();
    }
  }

  sortByColumn(columnName: string, sortedByDsc: boolean) {
    this.templateRequestModel.sort = columnName;
    this.templateRequestModel.isSortDsc = sortedByDsc;
    this.loadAllTemplates();
  }

  onTagInputChanged(tag: string) {
    this.templateRequestModel.nameFilter = tag;
    this.loadAllTemplates();
  }

  getLastPageNumber(): number {
    let lastPage = this.templateRequestModel.offset + this.templateRequestModel.pageSize;
    if (lastPage > this.templateListModel.numOfElements) {
      lastPage = this.templateListModel.numOfElements;
    }
    return lastPage;
  }
}
