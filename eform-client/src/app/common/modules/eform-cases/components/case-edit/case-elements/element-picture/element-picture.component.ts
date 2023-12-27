import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from 'ng-gallery';
import {Lightbox} from 'ng-gallery/lightbox';
import {FieldValueDto} from 'src/app/common/models';
import {TemplateFilesService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import * as R from 'ramda';
import {ActivatedRoute} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.scss']
})
export class ElementPictureComponent implements OnChanges, OnDestroy {
  @Input() fieldValues: Array<FieldValueDto> = [];
  @Output() pictureUpdated: EventEmitter<void> = new EventEmitter<void>();
  buttonsLocked = false;
  geoObjects = [];
  images = [];
  galleryImages: GalleryItem[] = [];
  caseId: number;

  imageSub$: Subscription;
  rotateImageSub$: Subscription;
  deleteImageSub$: Subscription;
  getImageSub$: Subscription;
  addImageSub$: Subscription;
  activatedRouteSub$: Subscription;
  addPictureDialogComponentAddedPictureSub$: any;
  deletePictureDialogComponentDeletePictureSub$: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private imageService: TemplateFilesService,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.images = [];
      this.activatedRouteSub$ = this.activateRoute.params.subscribe((params) => {
        this.caseId = +params['id'];
        if (isNaN(this.caseId)) {
          this.caseId = +params['sdkCaseId'];
        }
      });
      this.fieldValues.forEach(value => {
        if (value.uploadedDataObj) {
          this.geoObjects.push({
            lon: value.longitude,
            lat: value.latitude,
          });
          this.imageSub$ = this.imageService.getImage(value.uploadedDataObj.fileName).subscribe(blob => {
            const imageUrl = URL.createObjectURL(blob);
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

  deletePicture(image: any, modalId: string) {
    this.buttonsLocked = true;
    this.deleteImageSub$ = this.imageService
      .deleteImage(image.fileName, image.fieldId, image.uploadedObjId)
      .subscribe((data) => {
        if (data.success) {
          this.dialog.getDialogById(modalId).close()
          this.images = this.images.filter(x => x.fileName !== image.fileName);
        }
        this.buttonsLocked = false;
      });
  }

  rotatePicture(image: any) {
    this.buttonsLocked = true;
    this.rotateImageSub$ = this.imageService.rotateImage(image.fileName)
      .pipe(catchError((error, caught) => {
        this.buttonsLocked = false;
        return caught;
      }))
      .subscribe((operation) => {
        if (operation && operation.success) {
          const fileName = `${image.fileName}?noCache=${Math.floor(Math.random() * 1000)}`;
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
      });
  }

  openPicture(i: any) {
    this.updateGallery();
    if (this.galleryImages.length > 1) {
      this.gallery.ref('lightbox', {counterPosition: 'bottom'/*, loadingMode: 'indeterminate'*/}).load(this.galleryImages);
      this.lightbox.open(i);
    } else {
      this.gallery.ref('lightbox', {counter: false/*, loadingMode: 'indeterminate'*/}).load(this.galleryImages);
      this.lightbox.open(i);
    }
  }

  addPicture(newImage: File, modalId: string) {
    const fieldId = this.fieldValues.map(x => x.fieldId)[0];
    this.addImageSub$ = this.imageService
      .addNewImage(fieldId, this.caseId, newImage)
      .subscribe(data => {
        if (data && data.success) {
          this.dialog.getDialogById(modalId).close();
          this.pictureUpdated.emit();// fetch the new image
        }
      });
  }

  ngOnDestroy(): void {
  }

  openAddImage() {
    const modalId = this.dialog.open(AddPictureDialogComponent, dialogConfigHelper(this.overlay)).id;
    this.addPictureDialogComponentAddedPictureSub$ = this.dialog.getDialogById(modalId)
      .componentInstance.addedPicture.subscribe(x => {
        this.addPicture(x, modalId);
      });
  }

  openDeleteImage(file: File) {
    const modalId = this.dialog.open(DeletePictureDialogComponent, dialogConfigHelper(this.overlay, file)).id;
    this.deletePictureDialogComponentDeletePictureSub$ = this.dialog.getDialogById(modalId)
      .componentInstance.deletePicture.subscribe(x => {
        this.deletePicture(x, modalId);
      });
  }
}

@Component({
  selector: 'app-element-picture-add-picture-modal-component',
  template: `
    <div mat-dialog-title>
      {{ 'Select new image' | translate }}
    </div>
    <div mat-dialog-content>
      <input
        type="file"
        hidden
        accept="image/*"
        (change)="onFileSelected($event)"
        id="imageInput"
        #fileUpload
      />
      <div>
        {{
        image ? image.name :
          'No file uploaded yet.' | translate
        }}
        <button
          mat-raised-button
          color="primary"
          (click)="fileUpload.click()"
        >
          {{ 'Select image' | translate }}
        </button>
      </div>
    </div>
    <div mat-dialog-actions class="d-flex flex-row justify-content-end">
      <button
        mat-raised-button
        color="accent"
        (click)="onAddPicture()"
        [disabled]="!image"
      >
        {{ 'Save' | translate }}
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="hide()"
      >
        {{ 'Cancel' | translate }}
      </button>
    </div>`,
})
export class AddPictureDialogComponent {
  addedPicture: EventEmitter<File> = new EventEmitter<File>();
  image: File;
  constructor(
    public dialogRef: MatDialogRef<AddPictureDialogComponent>,
  ) {
  }

  onAddPicture() {
    this.addedPicture.emit(this.image)
  }


  onFileSelected(event: Event) {
    // @ts-ignore
    this.image = R.last(event.target.files);
  }

  hide() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-element-picture-delete-picture-modal-component',
  template: `
    <div mat-dialog-title>
      {{ 'Are you sure you want to delete it' | translate }}?
    </div>
    <div mat-dialog-actions class="d-flex flex-row justify-content-end">
      <button
        mat-raised-button
        color="warn"
        (click)="onDeletePicture()"
      >
        {{ 'Delete' | translate }}
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="hide()"
      >
        {{ 'Cancel' | translate }}
      </button>
    </div>`,
})
export class DeletePictureDialogComponent {
  deletePicture: EventEmitter<File> = new EventEmitter<File>();
  constructor(
    public dialogRef: MatDialogRef<DeletePictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public image: File,
  ) {
  }

  hide() {
    this.dialogRef.close();
  }

  onDeletePicture() {
    this.deletePicture.emit(this.image);
  }
}



