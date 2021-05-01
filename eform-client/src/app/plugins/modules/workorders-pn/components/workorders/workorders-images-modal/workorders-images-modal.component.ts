import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { WorkOrdersSettingsService } from '../../../../workorders-pn/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {Gallery, GalleryComponent, GalleryItem, ImageItem} from '@ngx-gallery/core';
import { TemplateFilesService } from 'src/app/common/services';
import { Lightbox } from '@ngx-gallery/lightbox';

@AutoUnsubscribe()
@Component({
  selector: 'app-workorders-images-modal',
  templateUrl: './workorders-images-modal.component.html',
  styleUrls: ['./workorders-images-modal.component.scss'],
})
export class WorkOrdersImagesModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @ViewChild(GalleryComponent) gallery: GalleryComponent;
  imageSub$: Subscription;
  images$: Observable<GalleryItem[]>;
  galleryImages: GalleryItem[] = [];

  constructor(
    private settingsService: WorkOrdersSettingsService,
    private imageService: TemplateFilesService,
    public lightbox: Lightbox
  ) {}

  ngOnInit(): void {

  }

  show(images: string[]) {
    this.composeGallery(images);
    this.frame.show();
  }

  composeGallery(images: string[]) {
    this.gallery.reset();
    images.forEach((value) => {
      this.imageSub$ = this.imageService.getImage(value).subscribe((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        this.gallery.addImage({ src: imageUrl, thumb: imageUrl });
      });
    });
  }

  ngOnDestroy() {}
}
