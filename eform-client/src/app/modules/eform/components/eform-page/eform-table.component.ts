import {Component, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect';
import {SiteNameDto, TemplateDto, TemplateColumnModel,
  UpdateColumnsModel, DeployModel, EFormCreateModel, DeployCheckbox,
  CommonDictionaryModel, TemplateTagsUpdateModel, TemplateRequestModel, TemplateListModel} from 'app/models';
import {EFormService, SitesService, NotifyService, EformTagService} from 'app/services';

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
  @ViewChild('updateTemplateTagsModal')
  updateTemplateTagsModal: ModalComponent;

  spinnerStatus = true;
  matchFound = false;
  isDeploying = false;
  isTagsProcessing = false;

  eFormCreateModel: EFormCreateModel = new EFormCreateModel();
  templateListModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;

  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  deploymentModalTitle: String = 'Edit deployment';

  selectedTemplateDto: TemplateDto = new TemplateDto();
  selectedTemplateTagsIds: Array<number> = [];

  availableTags: Array<CommonDictionaryModel> = [];

  columnModels: Array<TemplateColumnModel> = [];
  columnEditModel: UpdateColumnsModel = new UpdateColumnsModel;

  zipFileUploader: FileUploader = new FileUploader({url: '/api/template-files/upload-eform-zip'});

  isTagAddOpen = false;

  mySettings: IMultiSelectSettings = {
    dynamicTitleMaxItems: 3,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
  };
  myTexts: IMultiSelectTexts = {
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: '...',
    allSelected: 'All selected',
  };

  filterTagTexts: IMultiSelectTexts = {
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select tags for filter',
    allSelected: 'All selected',
  };


  constructor(private eFormService: EFormService,
              private notifyService: NotifyService,
              private sitesService: SitesService,
              private eformTagService: EformTagService) {
  }


  ngOnInit() {
    this.loadAllTemplates();
    this.loadAllTags();

    this.zipFileUploader.onBuildItemForm = (item, form) => {
      form.append('templateId', this.selectedTemplateDto.id);
    };
    this.zipFileUploader.onSuccessItem = () => {
      this.zipFileUploader.clearQueue();
      this.uploadTemplateZIPModal.dismiss();
    };
    this.zipFileUploader.onAfterAddingFile = f => {
      if (this.zipFileUploader.queue.length > 1) {
        this.zipFileUploader.removeFromQueue(this.zipFileUploader.queue[0]);
      }
    };
  }

  loadAllTags() {
    this.eformTagService.getAvailableTags().subscribe((data => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    }));
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
    if (this.eFormCreateModel != null) {
      this.eFormService.createSingle(this.eFormCreateModel).subscribe(operation => {
        if (operation && operation.success) {
          this.loadAllTemplates();
          this.eFormCreateModel = new EFormCreateModel;
          this.notifyService.success({text: operation.message || 'Error'});
        } else {
          this.notifyService.error({text: operation.message || 'Error'});
        }
        this.createTemplateModal.close();
        this.loadAllTags();
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

  showTemplateTagsEdit(templateDto: TemplateDto) {
    this.selectedTemplateDto = templateDto;
    this.selectedTemplateTagsIds = [];
    for (const templateTagKeyValue of templateDto.tags) {
      this.selectedTemplateTagsIds.push(templateTagKeyValue.key);
    }
    this.updateTemplateTagsModal.open();
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

  onLabelInputChanged(label: string) {
    this.templateRequestModel.nameFilter = label;
    this.loadAllTemplates();
  }

  getLastPageNumber(): number {
    let lastPage = this.templateRequestModel.offset + this.templateRequestModel.pageSize;
    if (lastPage > this.templateListModel.numOfElements) {
      lastPage = this.templateListModel.numOfElements;
    }
    return lastPage;
  }

  createNewTag(name: string) {
    this.isTagsProcessing = true;
    this.eformTagService.createTag(name).subscribe((operation => {
      this.isTagsProcessing = false;
      if (operation && operation.success) {
        this.loadAllTags();
        this.notifyService.success({text: operation.message || 'Error'});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    }));
  }

  removeTemplateTag(tagId: number) {
    this.isTagsProcessing = true;
    this.eformTagService.deleteTag(tagId).subscribe((operation => {
      this.isTagsProcessing = false;
      if (operation && operation.success) {
        this.loadAllTags();
        this.notifyService.success({text: operation.message || 'Error'});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    }));
  }

  updateTemplateTags(templateId: number) {
    this.isTagsProcessing = true;
    const templateTagsUpdateModel = new TemplateTagsUpdateModel();
    templateTagsUpdateModel.templateId = templateId;
    templateTagsUpdateModel.tagsIds = this.selectedTemplateTagsIds;
    this.eformTagService.updateTemplateTags(templateTagsUpdateModel).subscribe((operation => {
      this.isTagsProcessing = false;
      if (operation && operation.success) {
        this.loadAllTags();
        this.notifyService.success({text: operation.message || 'Error'});
        this.updateTemplateTagsModal.dismiss();
        this.loadAllTemplates();
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    }));
  }
}
