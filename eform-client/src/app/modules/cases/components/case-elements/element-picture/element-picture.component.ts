import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import {ImageService} from 'app/services/files';
import {NotifyService} from 'app/services/notify.service';
import {Gallery, GalleryItem} from 'ng-gallery';

@Component({
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.css']
})
export class ElementPictureComponent implements OnChanges {
  @Input() fieldValues: Array<CaseFieldValue> = [];
  geoObjects = [];
  images = [];
  galleryImages: Array<GalleryItem> = [];

  constructor(private gallery: Gallery, private imageService: ImageService, private notifyService: NotifyService) {
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
            src: '/api/template-files/get-image?&filename=' + value.uploadedDataObj.fileName,
            thumbnail: '/api/template-files/get-image?&filename=' + value.uploadedDataObj.fileName,
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
    this.gallery.reset();
    this.galleryImages = [];
    this.images.forEach(value => {
      this.galleryImages.push({
        src: '/api/template-files/get-image?&filename=' + value.src,
        thumbnail: '/api/template-files/get-image?&filename=' + value.thumbnail,
        text: value.text
      });
    });
    this.gallery.load(this.images);
  }

  openPicture(i: any) {
    this.updateGallery();
    this.gallery.open(i);
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
    this.imageService.rotateImage(image.fileName).subscribe((operation) => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
        this.images = this.images.filter(x => x.fileName !== image.fileName);
        image.src = image.src + '&noCache=' + Math.floor(Math.random() * 1000).toString();
        image.thumbnail = image.src;
        this.images.push(image);
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }
}
