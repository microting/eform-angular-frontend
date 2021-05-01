import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {ItemsListPnItemCaseModel} from '../../../models/list/items-list-case-pn.model';
import {ItemsGroupPlanningPnUploadedDataService} from '../../../services';
import {UploadedDatasModel} from '../../../models/list';

@Component({
  selector: 'app-uploaded-data-pdf',
  templateUrl: './uploaded-data-pdf.component.html',
  styleUrls: ['./uploaded-data-pdf.component.scss']
})
export class UploadedDataPdfComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onUploadedDataUploaded: EventEmitter<void> = new EventEmitter<void>();
  selectedItemCase: ItemsListPnItemCaseModel = new ItemsListPnItemCaseModel();
  uploadedDatasModel: UploadedDatasModel = new UploadedDatasModel();
  pdfFileUploader: FileUploader = new FileUploader({url: 'api/items-group-planning-pn/uploaded-data/pdf'});

  constructor(private toastrService: ToastrService, private translateService: TranslateService,
              private itemsPlanningPnUploadedDataService: ItemsGroupPlanningPnUploadedDataService) { }

  ngOnInit() {
    this.pdfFileUploader.onBuildItemForm = (item, form) => {
      form.append('itemCaseId', this.selectedItemCase.id);
    };
    this.pdfFileUploader.onSuccessItem = () => {
      this.pdfFileUploader.clearQueue();
      this.toastrService.success(this.translateService.instant('File has been uploaded successfully'));
      this.onUploadedDataUploaded.emit();
      this.frame.hide();
    };
    this.pdfFileUploader.onErrorItem = () => {
      this.pdfFileUploader.clearQueue();
      this.toastrService.error(this.translateService.instant('Error while uploading file'));
    };
    this.pdfFileUploader.onAfterAddingFile = f => {
      if (this.pdfFileUploader.queue.length > 1) {
        this.pdfFileUploader.removeFromQueue(this.pdfFileUploader.queue[0]);
      }
    };
  }

  getAllUploadedData(itemCaseId: number) {
    this.itemsPlanningPnUploadedDataService.getAllUploadedData(itemCaseId).subscribe((data) => {
      if (data && data.success) {
        this.uploadedDatasModel = data.model;

      }
    });
  }

  show(itemCase: ItemsListPnItemCaseModel) {
    this.selectedItemCase = itemCase;
    this.frame.show();
  }

  uploadPDF() {
    this.pdfFileUploader.queue[0].upload();
    this.onUploadedDataUploaded.emit();
  }

  hidePDFModal() {
    this.pdfFileUploader.clearQueue();
    this.frame.hide();
  }
}
