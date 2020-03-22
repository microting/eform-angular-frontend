import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {TemplateDto} from 'src/app/common/models/dto';

@Component({
  selector: 'app-eform-upload-zip-modal',
  templateUrl: './eform-upload-zip-modal.component.html',
  styleUrls: ['./eform-upload-zip-modal.component.scss']
})
export class EformUploadZipModalComponent implements OnInit {
  @ViewChild(('frame'), {static: false}) frame;
  selectedTemplate: TemplateDto = new TemplateDto();
  zipFileUploader: FileUploader = new FileUploader({
    url: '/api/template-files/upload-eform-zip', authToken: 'Bearer ' +
      JSON.parse(localStorage.getItem('currentAuth')).access_token});

  constructor(private toastrService: ToastrService, private translateService: TranslateService) { }

  ngOnInit() {
    this.zipFileUploader.onBuildItemForm = (item, form) => {
      form.append('templateId', this.selectedTemplate.id);
    };
    this.zipFileUploader.onSuccessItem = () => {
      this.zipFileUploader.clearQueue();
      this.toastrService.success(this.translateService.instant('File has been uploaded successfully'));
      this.frame.hide();
    };
    this.zipFileUploader.onErrorItem = () => {
      this.zipFileUploader.clearQueue();
      this.toastrService.error(this.translateService.instant('Error while uploading file'));
    };
    this.zipFileUploader.onAfterAddingFile = f => {
      if (this.zipFileUploader.queue.length > 1) {
        this.zipFileUploader.removeFromQueue(this.zipFileUploader.queue[0]);
      }
    };
  }

  show(templateDto: TemplateDto) {
    this.selectedTemplate = templateDto;
    this.frame.show();
  }

  uploadTemplateZIP() {
    this.zipFileUploader.queue[0].upload();
  }

  hideZipModal() {
    this.zipFileUploader.clearQueue();
    this.frame.hide();
  }
}
