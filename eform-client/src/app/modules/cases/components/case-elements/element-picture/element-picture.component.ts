import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import {ImageService, NotifyService} from 'app/services';
import {NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';


@Component({
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.css']
})
export class ElementPictureComponent implements OnChanges, OnInit {
  @Input() fieldValues: Array<CaseFieldValue> = [];
  isRotateLocked = false;
  geoObjects = [];
  images = [];
  galleryImages: NgxGalleryImage[] = [];
  galleryOptions: NgxGalleryOptions[] = [];
  @ViewChild(NgxGalleryComponent) ngxGalleryComponent: NgxGalleryComponent;

  constructor(private imageService: ImageService, private notifyService: NotifyService) {
  }

  ngOnInit() {
    this.galleryOptions = [
      { image: false, thumbnails: false, width: '0px', height: '0px' },
      {breakpoint: 500, width: '100%'}
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.fieldValues.forEach(value => {
        if (value.uploadedDataObj) {
          this.geoObjects.push({
            lon: value.longitude,
            lat: value.latitude,
          });
          this.images.push({
            src: '/api/template-files/get-image/' + value.uploadedDataObj.fileName,
            thumbnail: '/api/template-files/get-image/' + value.uploadedDataObj.fileName,
            fileName: value.uploadedDataObj.fileName,
            text: value.id.toString(),
            googleMapsLat: value.latitude,
            googleMapsLon: value.longitude,
            googleMapsUrl: 'https://www.google.com/maps/place/' + value.latitude + ',' + value.longitude,
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

  openGpsWindow(url: string) {
    window.open(url, '_blank');
  }

  deletePicture(image: any) {
    this.imageService.deleteImage(image.fileName, image.fieldId, image.uploadedObjId).subscribe((data) => {
      if (data.success) {
        this.images = this.images.filter(x => x.fileName !== image.fileName);
      }
    });
  }

  rotatePicture(image: any) {
    this.isRotateLocked = true;
    this.imageService.rotateImage(image.fileName).subscribe((operation) => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
        this.images = this.images.filter(x => x.fileName !== image.fileName);
        image.src = image.src + '&noCache=' + Math.floor(Math.random() * 1000).toString();
        image.thumbnail = image.src;
        this.images.push(image);
        this.updateGallery();
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.isRotateLocked = false;
    }, () => this.isRotateLocked = false);
  }
}
