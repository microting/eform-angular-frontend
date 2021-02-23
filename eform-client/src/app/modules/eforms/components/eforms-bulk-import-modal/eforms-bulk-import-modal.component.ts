import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/common/services';
import { LoaderService } from 'src/app/common/services/loeader.service';
import { EFormService } from 'src/app/common/services/eform/eform.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-eforms-bulk-import-modal',
  templateUrl: './eforms-bulk-import-modal.component.html',
  styleUrls: ['./eforms-bulk-import-modal.component.scss'],
})
export class EformsBulkImportModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('xlsxEforms', { static: false })
  xlsxEformsInput: ElementRef;
  xlsxEformsFileUploader: FileUploader = new FileUploader({
    url: '/api/templates/import',
    authToken: this.authService.bearerToken,
  });
  @Output() importFinished = new EventEmitter<void>();
  errors: { row: number; col: number; message: string }[];
  xlsxFile: File;
  importSubscription$: Subscription;

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private eFormService: EFormService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    this.xlsxEformsFileUploader.onSuccessItem = (item, response) => {
      const model = JSON.parse(response).model;
      if (model) {
        this.errors = JSON.parse(response).model.errors;
        this.xlsxEformsFileUploader.clearQueue();
      }
      if (this.errors && this.errors.length > 0) {
        this.toastrService.warning(
          this.translateService.instant('Import has been finished partially')
        );
      } else {
        this.xlsxEformsFileUploader.clearQueue();
        this.toastrService.success(
          this.translateService.instant('Import has been finished successfully')
        );
        this.frame.hide();
        this.importFinished.emit();
      }
      this.loaderService.isLoading.next(false);
      this.xlsxEformsInput.nativeElement.value = '';
    };
    this.xlsxEformsFileUploader.onErrorItem = () => {
      this.xlsxEformsFileUploader.clearQueue();
      this.toastrService.error(
        this.translateService.instant('Error while making import')
      );
      this.xlsxEformsInput.nativeElement.value = '';
    };
    this.xlsxEformsFileUploader.onAfterAddingFile = (f) => {
      if (this.xlsxEformsFileUploader.queue.length > 1) {
        this.xlsxEformsFileUploader.removeFromQueue(
          this.xlsxEformsFileUploader.queue[0]
        );
      }
      this.errors = [];
    };
  }

  show() {
    this.frame.show();
    this.xlsxFile = null;
  }

  uploadExcelEformsFile(fileInput) {
    this.xlsxFile = fileInput.target.files[0] as File;
    this.xlsxEformsFileUploader.progress = 100;
    this.importSubscription$ = this.eFormService
      .importEFormsFromExcel(this.xlsxFile)
      .subscribe((result) => {
        if (result && result.success) {
          this.importFinished.emit();
          this.excelEformsModal();
        }
      });
  }

  excelEformsModal() {
    this.frame.hide();
    this.xlsxEformsFileUploader.clearQueue();
    this.xlsxFile = null;
  }
}
