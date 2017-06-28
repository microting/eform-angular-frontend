/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {NotifyService} from './notify.service';

describe('Service: Notify', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotifyService]
    });
  });

  it('should ...', inject([NotifyService], (service: NotifyService) => {
    expect(service).toBeTruthy();
  }));
});
