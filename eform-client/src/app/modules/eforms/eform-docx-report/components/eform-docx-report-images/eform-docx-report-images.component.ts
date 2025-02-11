import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from 'ng-gallery';
import {Subscription} from 'rxjs';
import {Lightbox} from 'ng-gallery/lightbox';
import {TemplateFilesService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {catchError} from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
    selector: 'app-eform-docx-report-images',
    templateUrl: './eform-docx-report-images.component.html',
    styleUrls: ['./eform-docx-report-images.component.scss'],
    standalone: false
})
export class EformDocxReportImagesComponent implements OnDestroy, OnChanges {
  @Input() imageNames: {key: {key: number, value: string}, value: {key: string, value: string}}[] = [];
  images: {key: number, value: any}[] = [];
  galleryImages: GalleryItem[] = [];
  imageSub$: Subscription;
  buttonsLocked = false;

  constructor(public gallery: Gallery, public lightbox: Lightbox, private imageService: TemplateFilesService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.imageNames) {
      this.images = [];
      this.imageNames.forEach(imageValue => {
        this.imageSub$ = this.imageService.getImage(imageValue.value[0]).subscribe(blob => {
          const imageUrl = URL.createObjectURL(blob);
          const val = {
            src: imageUrl,
            thumbnail: imageUrl,
            fileName: imageValue.value[0],
            name: imageValue.key[1],
            geoTag: imageValue.value[1]
          };
          this.images.push({key: Number(imageValue.key[0]), value: val});
          this.images.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
        });
      });
      if (this.images.length > 0) {
        this.updateGallery();
      }
    }
  }

  updateGallery() {
    this.galleryImages = [];
    this.images.forEach(value => {
      this.galleryImages.push( new ImageItem({ src: value.value.src, thumb: value.value.thumbnail }));
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

  ngOnDestroy(): void {
  }

  openGpsWindow(url: string) {
    window.open(url, '_blank');
  }

  rotatePicture(image: any) {
    this.buttonsLocked = true;
    this.imageService.rotateImage(image.fileName)
      .pipe(catchError((error, caught) => {
        this.buttonsLocked = false;
        return caught;
      }))
      .subscribe((operation) => {
      if (operation && operation.success) {
        const fileName = `${image.fileName}?noCache=${Math.floor(Math.random() * 1000)}`;
        this.imageService.getImage(fileName).subscribe(blob => {
          const imageUrl = URL.createObjectURL(blob);
          const currentImage = this.images.find(x => x.value.fileName === image.fileName);
          this.images = this.images.filter(x => x.value.fileName !== image.fileName);
          currentImage.value.src = imageUrl;
          currentImage.value.thumbnail = image.src;
          this.images.push(currentImage);
          this.updateGallery();
        });
      }
      this.buttonsLocked = false;
    });
  }
}
