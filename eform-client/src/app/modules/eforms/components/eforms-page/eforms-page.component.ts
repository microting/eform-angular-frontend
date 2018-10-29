import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {TemplateDto} from 'src/app/common/models/dto';
import {TemplateListModel, TemplateRequestModel} from 'src/app/common/models/eforms';
import {AuthService} from 'src/app/common/services/auth';
import {EFormService, EFormTagService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-page',
  templateUrl: './eforms-page.component.html',
  styleUrls: ['./eforms-page.component.scss']
})
export class EformsPageComponent implements OnInit {

  @ViewChild('modalNewEform') newEformModal;
  @ViewChild('modalCasesColumns') modalCasesColumnsModal;
  @ViewChild('modalParing') modalPairing;
  @ViewChild('modalEditTags') modalEditTags;
  @ViewChild('modalRemoveEform') modalRemoveEform;
  @ViewChild('modalUploadZip') modalUploadZip;

  spinnerStatus = false;
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel;
  templateListModel: TemplateListModel = new TemplateListModel();
  availableTags: Array<CommonDictionaryModel> = [];

  get userClaims() { return this.authService.userClaims; }

  items = [
    'New',
    'Legacy',
    'Test1'
  ];

  constructor(private eFormService: EFormService, private eFormTagService: EFormTagService, private authService: AuthService) { }

  ngOnInit() {
    this.loadAllTemplates();
    this.loadAllTags();
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

  loadAllTags() {
    this.eFormTagService.getAvailableTags().subscribe((data => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    }));
  }

  onLabelInputChanged(label: string) {
    this.templateRequestModel.nameFilter = label;
    this.loadAllTemplates();
  }

  sortByColumn(columnName: string, sortedByDsc: boolean) {
    this.templateRequestModel.sort = columnName;
    this.templateRequestModel.isSortDsc = sortedByDsc;
    this.loadAllTemplates();
  }



  openNewEformModal() {
    this.newEformModal.show();
  }

  openEditColumnsModal(templateDto: TemplateDto) {
    this.modalCasesColumnsModal.show(templateDto);
  }

  openEformDeleteModal(templateDto: TemplateDto) {
    this.modalRemoveEform.show(templateDto);
  }

  uploadZipFile(templateDto: TemplateDto) {
    this.modalUploadZip.show(templateDto);
  }

  downloadItem(itemName: string, templateId: number) {
    if (itemName == 'XML') {
      window.open('/api/template-files/download-eform-xml/' + templateId, '_blank');
    } else {
      window.open('/api/template-files/csv/' + templateId, '_blank');
    }
  }

  openPairingModal(templateDto: TemplateDto) {
    this.modalPairing.show(templateDto);
  }

  openEditTagsModal(templateDto: TemplateDto) {
    this.modalEditTags.show(templateDto);
  }
}
