import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemsListPnItemCaseModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsGroupPlanningPnCasesService, ItemsGroupPlanningPnUploadedDataService} from '../../../services';
import {ItemsListPnCaseResultModel, UploadedDataModel, UploadedDatasModel} from '../../../models/list';

@Component({
  selector: 'app-item-case-uploaded-data',
  templateUrl: './item-case-uploaded-data.component.html',
  styleUrls: ['./item-case-uploaded-data.component.scss']
})
export class ItemCaseUploadedDataComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @ViewChild('uploadedDataPdfModal', {static: false}) uploadedDataPdfModal;
  @ViewChild('uploadedDataDeleteModal', {static: false}) uploadedDataDeleteModal;
  uploadedDatasModel: UploadedDatasModel = new UploadedDatasModel();
  selectedListCase: ItemsListPnItemCaseModel = new ItemsListPnItemCaseModel();
  selectedListCaseResult: ItemsListPnCaseResultModel = new ItemsListPnCaseResultModel();
  selectedListCaseId: number;

  constructor( private itemsGroupPlanningPnCasesService: ItemsGroupPlanningPnCasesService,
               private itemsGroupPlanningPnUploadedDataService: ItemsGroupPlanningPnUploadedDataService) { }

  ngOnInit() {
  }

  show(selectedListCase: ItemsListPnCaseResultModel) {
    this.selectedListCaseId = selectedListCase.id;
    this.getSelectedListCase(selectedListCase.id);
  }

  getSelectedListCase(id: number) {
    this.itemsGroupPlanningPnCasesService.getSingleCase(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedListCase = data.model;
        this.frame.show(this.selectedListCase);
        this.getAllUploadedData(id);
      }
    });
  }

  getAllUploadedData(itemCaseId: number) {
    this.itemsGroupPlanningPnUploadedDataService.getAllUploadedData(itemCaseId).subscribe((data) => {
      if (data && data.success) {
        this.uploadedDatasModel = data.model;
      }
    });
  }

  getMessage() {
    this.getAllUploadedData(this.selectedListCaseId);
  }

  downloadUploadedDataPdf(fileName: string) {
    // this.itemsPlanningPnUploadedDataService.downloadUploadedDataPdf(fileName);
    window.open('api/template-files/get-pdf/' + fileName);
  }

  showUploadPDFModal() {
    this.uploadedDataPdfModal.show(this.selectedListCase);
  }

  showUploadedDataDeleteModal(uploadedData: UploadedDataModel) {
    this.uploadedDataDeleteModal.show(uploadedData);
  }
}
