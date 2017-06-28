/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {EFormService} from './eform.service';

describe('Service: EForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EFormService]
    });
  });

  it('should ...', inject([EFormService], (service: EFormService) => {
    expect(service).toBeTruthy();
  }));
});
