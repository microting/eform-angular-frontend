import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from '@ngx-gallery/core';
import {Lightbox} from '@ngx-gallery/lightbox';
import {FieldValueDto} from 'src/app/common/models';
import {TemplateFilesService} from 'src/app/common/services/cases';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import * as R from 'ramda';
import {ActivatedRoute} from '@angular/router';
import {ModalDirective} from 'angular-bootstrap-md';

@AutoUnsubscribe()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.scss']
})
export class ElementPictureComponent implements OnChanges, OnDestroy {
  @ViewChild('updateAddNewImageModal', {static: false}) updateAddNewImageModal: ModalDirective;
  @ViewChild('confirmDeleteImageModal', {static: false}) confirmDeleteImageModal: ModalDirective;
  @Input() fieldValues: Array<FieldValueDto> = [];
  @Output() pictureUpdated: EventEmitter<void> = new EventEmitter<void>();
  buttonsLocked = false;
  geoObjects = [];
  images = [];
  galleryImages: GalleryItem[] = [];
  imageIdForUpdate: number;
  newImageForUpdate: File;
  caseId: number;

  imageSub$: Subscription;
  rotateImageSub$: Subscription;
  deleteImageSub$: Subscription;
  getImageSub$: Subscription;
  updateImageSub$: Subscription;
  addImageSub$: Subscription;
  activatedRouteSub$: Subscription;
  imageForDelete: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private imageService: TemplateFilesService,
    public gallery: Gallery,
    public lightbox: Lightbox
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
        this.caseId = +params['id'];
      });
      this.fieldValues.forEach(value => {
        if (value.uploadedDataObj) {
          this.geoObjects.push({
            lon: value.longitude,
            lat: value.latitude,
          });
          this.imageSub$ = this.imageService.getImage(value.uploadedDataObj.fileName).subscribe(blob => {
            const imageUrl = URL.createObjectURL(blob);
            // TODO: CHECK
            this.images.push({
              src: imageUrl,
              thumbnail: imageUrl,
              fileName: value.uploadedDataObj.fileName,
              text: value.id.toString(),
              googleMapsLat: value.latitude,
              googleMapsLon: value.longitude,
              googleMapsUrl: 'https://www.google.com/maps/place/' + value.latitude + ',' + value.longitude,
              fieldId: value.fieldId,
              uploadedObjId: value.uploadedDataObj.id
            });
            this.images = this.images.sort((a, b) => a.fileName.localeCompare(b.fileName));
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
    this.images = this.images.sort((a, b) => a.fileName.localeCompare(b.fileName));
    this.images.forEach(value => {
      this.galleryImages.push(new ImageItem({src: value.src, thumb: value.thumbnail}));
    });
  }

  openGpsWindow(url: string) {
    window.open(url, '_blank');
  }

  deletePicture(image: any) {
    this.buttonsLocked = true;
    this.deleteImageSub$ = this.imageService
      .deleteImage(image.fileName, image.fieldId, image.uploadedObjId)
      .subscribe((data) => {
      if (data.success) {
        this.images = this.images.filter(x => x.fileName !== image.fileName);
      }
      this.imageForDelete = undefined;
      this.confirmDeleteImageModal.hide()
      this.buttonsLocked = false;
    });
  }

  rotatePicture(image: any) {
    this.buttonsLocked = true;
    this.rotateImageSub$ = this.imageService.rotateImage(image.fileName).subscribe((operation) => {
      if (operation && operation.success) {
        const fileName = image.fileName + '?noCache=' + Math.floor(Math.random() * 1000).toString();
        this.getImageSub$ = this.imageService.getImage(fileName).subscribe(blob => {
          const imageUrl = URL.createObjectURL(blob);
          const currentImage = this.images.find(x => x.fileName === image.fileName);
          this.images = this.images.filter(x => x.fileName !== image.fileName);
          currentImage.src = imageUrl;
          currentImage.thumbnail = image.src;
          this.images.push(currentImage);
          this.updateGallery();
        });
      }
      this.buttonsLocked = false;
    }, () => this.buttonsLocked = false);
  }

  openPicture(i: any) {
    this.updateGallery();
    if (this.galleryImages.length > 1) {
      this.gallery.ref('lightbox', {counterPosition: 'bottom', loadingMode: 'indeterminate'}).load(this.galleryImages);
      this.lightbox.open(i);
    } else {
      // this.gallery.destroyAll();
      // this.gallery.resetAll();
      this.gallery.ref('lightbox', {counter: false, loadingMode: 'indeterminate'}).load(this.galleryImages);
      this.lightbox.open(i);
    }
  }

  updatePicture() {
    this.updateImageSub$ = this.imageService
      .updateImage(this.imageIdForUpdate, this.newImageForUpdate)
      .subscribe(data => {
        if (data && data.success) {
          this.updateAddNewImageModal.hide();
          this.imageIdForUpdate = undefined;
          this.newImageForUpdate = null;
          this.pictureUpdated.emit();
        }
      });
  }

  onFileSelected(event: Event) {
    // @ts-ignore
    this.newImageForUpdate = R.last(event.target.files);
  }

  addPicture() {
    const fieldId = this.fieldValues.map(x => x.fieldId)[0];
    this.addImageSub$ = this.imageService
      .addNewImage(fieldId, this.caseId, this.newImageForUpdate)
      .subscribe(data => {
        if (data && data.success) {
          this.updateAddNewImageModal.hide();
          this.newImageForUpdate = null;
          // TODO add code, which fetch the new image
        }
      });
  }

  ngOnDestroy(): void {
  }
}
