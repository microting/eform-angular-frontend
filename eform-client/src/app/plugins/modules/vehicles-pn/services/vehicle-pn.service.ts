import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BaseService} from 'app/services/base.service';
import {Router} from '@angular/router';

import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';

export let VehiclePnMethods = {
  VehiclePn: 'api/plugins/vehicles-pn'
};

@Injectable()
export class VehiclePnService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAllVehicles(): Observable<any> {
    return this.get(VehiclePnMethods.VehiclePn);
  }

  updateVehicle(): Observable<any> {
    return this.get(VehiclePnMethods.VehiclePn);
  }

  createVehicle(): Observable<any> {
    return this.get(VehiclePnMethods.VehiclePn);
  }
}
