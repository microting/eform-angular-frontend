import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import {NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';

@Component({
  selector: 'element-signature',
  templateUrl: './element-signature.component.html',
  styleUrls: ['./element-signature.component.css']
})
export class ElementSignatureComponent implements OnInit, OnChanges {
  @Input() fieldValues: Array<CaseFieldValue> = [];
  images = [];
  galleryImages: NgxGalleryImage[] = [];
  galleryOptions: NgxGalleryOptions[] = [];
  @ViewChild(NgxGalleryComponent) ngxGalleryComponent: NgxGalleryComponent;

  constructor() {
  }

  ngOnInit() {
    this.galleryOptions = [
      {image: false, thumbnails: false, width: '0px', height: '0px'},
      {breakpoint: 500, width: '100%'}
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.fieldValues.forEach(value => {
        if (value.uploadedDataObj) {
          this.images.push({
            src: '/api/template-files/get-image/' + value.uploadedDataObj.fileName,
            thumbnail: '/api/template-files/get-image/' + value.uploadedDataObj.fileName,
            fileName: value.uploadedDataObj.fileName,
            text: value.id.toString(),
            fieldId: value.fieldId,
            uploadedObjId: value.uploadedDataObj.id
          });
        }
      });
      if (this.images.length > 0) {
        this.updateGallery();
      }
    }
  }

  updateGallery() {
    this.galleryImages = [];
    this.images.forEach(value => {
      this.galleryImages.push({
        small: value.thumbnail,
        medium: value.src,
        big: value.src
      });
    });
  }

  openPicture(i: any) {
    this.updateGallery();
    this.ngxGalleryComponent.openPreview(i);
  }
}
