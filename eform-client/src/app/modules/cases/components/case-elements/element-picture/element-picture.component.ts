import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CaseFieldValue} from 'app/models';
import {GalleryService} from 'ng-gallery';
import {AgmCoreModule} from '@agm/core';

@Component({
  selector: 'element-picture',
  templateUrl: './element-picture.component.html',
  styleUrls: ['./element-picture.component.css']
})
export class ElementPictureComponent implements OnChanges {
  @Input() fieldValues: Array<CaseFieldValue> = [];
  geoObjects = [];
  images = [];

  constructor(private gallery: GalleryService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.fieldValues) {
      this.fieldValues.forEach(value => {
        this.geoObjects.push({
          lon: value.longitude,
          lat: value.latitude,
        });
        this.images.push({
          src: '/api/templates/getimage?&filename=' + value.uploadedDataObj.fileName,
          thumbnail: '/api/templates/getimage?&filename=' + value.uploadedDataObj.fileName,
          text: value.id.toString(),
          googleMapsLat: value.latitude,
          googleMapsLon: value.longitude,
          googleMapsUrl: 'https://www.google.com/maps/place/' + value.latitude + ',' + value.longitude,
        });
      });
      this.gallery.load(this.images);
    }
  }
}
