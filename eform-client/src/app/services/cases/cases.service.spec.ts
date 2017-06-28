/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {CasesService} from './cases.service';

describe('Service: Cases', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CasesService]
    });
  });

  it('should ...', inject([CasesService], (service: CasesService) => {
    expect(service).toBeTruthy();
  }));
});
