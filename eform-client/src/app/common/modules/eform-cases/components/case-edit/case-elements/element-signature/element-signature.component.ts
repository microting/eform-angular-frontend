import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Gallery, GalleryItem, ImageItem} from 'ng-gallery';
import {FieldValueDto} from 'src/app/common/models';
import {TemplateFilesService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {Lightbox} from 'ng-gallery/lightbox';


@AutoUnsubscribe()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-signature',
  templateUrl: './element-signature.component.html',
  styleUrls: ['./element-signature.component.scss']
})
export class ElementSignatureComponent implements OnChanges, OnDestroy {
  @Input() fieldValues: Array<FieldValueDto> = [];
  images = [];
  galleryImages: GalleryItem[] = [];
  imageSub$: Subscription;

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    private imageService: TemplateFilesService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.fieldValues.forEach(value => {
        if (value.uploadedDataObj) {
          this.imageSub$ = this.imageService.getImage(value.uploadedDataObj.fileName).subscribe(blob => {
            const imageUrl = URL.createObjectURL(blob);
            this.images.push({
              src: imageUrl,
              thumbnail: imageUrl,
              fileName: value.uploadedDataObj.fileName,
              text: value.id.toString(),
              uploadedObjId: value.uploadedDataObj.id
            });
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
      this.galleryImages.push( new ImageItem({ src: value.src, thumb: value.thumbnail }));
    });
  }

  openPicture(i: any) {
    this.updateGallery();
    if (this.galleryImages.length > 1) {
      this.gallery.ref('lightbox', {counterPosition: 'bottom'}).load(this.galleryImages);
      this.lightbox.open(i);
    } else {
      this.gallery.ref('lightbox', {counter: false}).load(this.galleryImages);
      this.lightbox.open(i);
    }
  }

  ngOnDestroy(): void {
  }
}
