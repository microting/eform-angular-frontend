import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-eform-report-cropper',
  templateUrl: './eform-report-cropper.component.html',
  styleUrls: ['./eform-report-cropper.component.scss']
})
export class EformReportCropperComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onImageCropped: EventEmitter<string> = new EventEmitter<string>();
  imageChangedEvent: any = '';
  croppedImage: any = '';
  error: string;
  cropperReady = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.cropperReady = true;
  }
  loadImageFailed () {
    this.error = 'Image loading failed';
  }

  saveImage() {
    this.onImageCropped.emit(this.croppedImage);
    this.frame.hide();
  }


}
