export class Gallery {
  ref(id: string, config?: any) {
    return {
      load: jest.fn()
    };
  }
}

export class GalleryItem {
  constructor(public data: any) {}
}

export class ImageItem extends GalleryItem {
  constructor(data: any) {
    super(data);
  }
}
