import {GalleryConfig} from 'ng-gallery';

export const galleryConfig: GalleryConfig =  {
  'gestures': true,
  'style': {
    'background': '#121519',
    'width': '900px',
    'height': '600px'
  },
  'navigation': true,
  'loader': {
    'width': '50px',
    'height': '50px',
    'icon': 'oval',
//    'position': 'center'
  },
  'description': {
    'position': 'bottom',
    'overlay': true,
    'text': true,
    'counter': true,
    'style': {
      'textShadow': '0 0 2px rgba(0,0,0,0.5)'
    }
  },
  'player': {
    'autoplay': false,
    'interval': 3000,
    'progress': true,
   // 'speed': 3000
  },
  'thumbnails': {
    'width': 70,
    'height': 70,
    'position': 'top',
    'space': 10
  },
  'lightbox': {
    'backdropClass': 'g-backdrop',
    'panelClass': 'g-overlay',
    'hasBackdrop': true,
    'positionStrategy': 'GlobalPositionStrategy',
    'scrollStrategy': 'BlockScrollStrategy'
  },
  'bullets': false
};
