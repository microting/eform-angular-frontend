import {Component, OnInit, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/common/services';
import {LoaderService} from 'src/app/common/services/loeader.service';

@Component({
  selector: 'app-eforms-bulk-import-modal',
  templateUrl: './eforms-bulk-import-modal.component.html',
  styleUrls: ['./eforms-bulk-import-modal.component.scss']
})
export class EformsBulkImportModalComponent implements OnInit {
  @ViewChild('frame', {static: true}) frame;
  xlsxEformsFileUploader: FileUploader = new FileUploader({
    url: '/api/templates/import', authToken: this.authService.bearerToken
  });
  errors: {row: number, col: number, message: string}[];

  constructor(private toastrService: ToastrService,
              private translateService: TranslateService,
              private authService: AuthService,
              private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.xlsxEformsFileUploader.onSuccessItem = (item, response) => {
      this.errors = JSON.parse(response).model.errors;
      if (!this.errors) {
        this.xlsxEformsFileUploader.clearQueue();
        this.toastrService.success(this.translateService.instant('Import has been finished successfully'));
        this.frame.hide();
      } else {
        this.toastrService.warning(this.translateService.instant('Import has been finished partially'));
      }
      this.loaderService.isLoading.next(false);
    };
    this.xlsxEformsFileUploader.onErrorItem = () => {
      this.xlsxEformsFileUploader.clearQueue();
      this.toastrService.error(this.translateService.instant('Error while making import'));
    };
    this.xlsxEformsFileUploader.onAfterAddingFile = f => {
      if (this.xlsxEformsFileUploader.queue.length > 1) {
        this.xlsxEformsFileUploader.removeFromQueue(this.xlsxEformsFileUploader.queue[0]);
      }
    };
  }

  show() {
    this.frame.show();
  }

  uploadExcelEformsFile() {
    this.xlsxEformsFileUploader.queue[0].upload();
    this.loaderService.isLoading.next(true);
  }

  excelEformsModal() {
    this.xlsxEformsFileUploader.clearQueue();
    this.frame.hide();
  }
}
