import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {TemplateDto} from 'src/app/common/models/dto';
import {AuthStateService} from 'src/app/common/store';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-eform-upload-zip-modal',
  templateUrl: './eform-upload-zip-modal.component.html',
  styleUrls: ['./eform-upload-zip-modal.component.scss'],
})
export class EformUploadZipModalComponent implements OnInit {
  zipFileUploader: FileUploader = new FileUploader({
    url: '/api/template-files/upload-eform-zip',
    authToken: this.authStateService.bearerToken,
  });

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private authStateService: AuthStateService,
    public dialogRef: MatDialogRef<EformUploadZipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedTemplate: TemplateDto,
  ) {
  }

  ngOnInit() {
    this.zipFileUploader.onBuildItemForm = (item, form) => {
      form.append('templateId', this.selectedTemplate.id);
    };
    this.zipFileUploader.onSuccessItem = () => {
      this.zipFileUploader.clearQueue();
      this.toastrService.success(
        this.translateService.instant('File has been uploaded successfully')
      );
      this.hideZipModal(true);
    };
    this.zipFileUploader.onErrorItem = () => {
      this.zipFileUploader.clearQueue();
      this.toastrService.error(
        this.translateService.instant('Error while uploading file')
      );
    };
    this.zipFileUploader.onAfterAddingFile = (f) => {
      if (this.zipFileUploader.queue.length > 1) {
        this.zipFileUploader.removeFromQueue(this.zipFileUploader.queue[0]);
      }
    };
  }

  uploadTemplateZIP() {
    this.zipFileUploader.queue[0].upload();
  }

  hideZipModal(result = false) {
    this.zipFileUploader.clearQueue();
    this.dialogRef.close(result);
  }
}
