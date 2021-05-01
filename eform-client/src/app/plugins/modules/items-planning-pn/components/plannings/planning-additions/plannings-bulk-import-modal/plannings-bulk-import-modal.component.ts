import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/common/services';
import { LoaderService } from 'src/app/common/services/loeader.service';

@Component({
  selector: 'app-plannings-bulk-import-modal',
  templateUrl: './plannings-bulk-import-modal.component.html',
  styleUrls: ['./plannings-bulk-import-modal.component.scss'],
})
export class PlanningsBulkImportModalComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @ViewChild('xlsxPlannings', { static: false }) xlsxPlannings: ElementRef;
  @Output() importFinished = new EventEmitter<void>();
  xlsxPlanningsFileUploader: FileUploader = new FileUploader({
    url: '/api/items-planning-pn/plannings/import',
    authToken: this.authService.bearerToken,
  });
  errors: { row: number; col: number; message: string }[];

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.xlsxPlanningsFileUploader.onSuccessItem = (item, response) => {
      const model = JSON.parse(response).model;
      if (model) {
        this.errors = JSON.parse(response).model.errors;
        this.xlsxPlanningsFileUploader.clearQueue();
      }
      if (this.errors && this.errors.length > 0) {
        this.toastrService.warning(
          this.translateService.instant('Import has been finished partially')
        );
      } else {
        this.toastrService.success(
          this.translateService.instant('Import has been finished successfully')
        );
        this.importFinished.emit();
        this.excelPlanningsModal();
      }
      this.loaderService.isLoading.next(false);
      this.xlsxPlannings.nativeElement.value = '';
    };
    this.xlsxPlanningsFileUploader.onErrorItem = () => {
      this.xlsxPlanningsFileUploader.clearQueue();
      this.toastrService.error(
        this.translateService.instant('Error while making import')
      );
      this.xlsxPlannings.nativeElement.value = '';
    };
    this.xlsxPlanningsFileUploader.onAfterAddingFile = (f) => {
      if (this.xlsxPlanningsFileUploader.queue.length > 1) {
        this.xlsxPlanningsFileUploader.removeFromQueue(
          this.xlsxPlanningsFileUploader.queue[0]
        );
      }
    };
  }

  show() {
    this.xlsxPlanningsFileUploader.clearQueue();
    this.frame.show();
  }

  uploadExcelPlanningsFile() {
    this.xlsxPlanningsFileUploader.queue[0].upload();
    this.loaderService.isLoading.next(true);
  }

  excelPlanningsModal() {
    this.frame.hide();
    this.xlsxPlanningsFileUploader.clearQueue();
  }
}
