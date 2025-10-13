import { Component, OnInit, inject } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {TemplateDto} from 'src/app/common/models/dto';
import {AuthStateService} from 'src/app/common/store';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {selectBearerToken} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Component({
    selector: 'app-eform-uplo ad-zip-modal',
    templateUrl: './eform-upload-zip-modal.component.html',
    styleUrls: ['./eform-upload-zip-modal.component.scss'],
    standalone: false
})
export class EformUploadZipModalComponent implements OnInit {
  private toastrService = inject(ToastrService);
  private authStore = inject(Store);
  private translateService = inject(TranslateService);
  private authStateService = inject(AuthStateService);
  dialogRef = inject<MatDialogRef<EformUploadZipModalComponent>>(MatDialogRef);
  selectedTemplate = inject<TemplateDto>(MAT_DIALOG_DATA);

  zipFileUploader: FileUploader;
  private selectBearerToken$ = this.authStore.select(selectBearerToken);

  ngOnInit() {
    let token = '';
    this.selectBearerToken$.subscribe((bearerToken) => {
      token = bearerToken;
    });
    this.zipFileUploader  = new FileUploader({
      url: '/api/template-files/upload-eform-zip',
      authToken: 'Bearer '+token,
    });
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
