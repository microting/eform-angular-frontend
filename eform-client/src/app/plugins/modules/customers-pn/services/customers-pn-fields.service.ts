import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {FieldsPnUpdateModel} from '../models';

export let CustomerPnFieldsMethods = {
  CustomerPnFields: 'api/fields-pn'
};

@Injectable()
export class CustomersPnFieldsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllFields(): Observable<OperationDataResult<FieldsPnUpdateModel>> {
    return this.get(CustomerPnFieldsMethods.CustomerPnFields);
  }

  updateFields(model: FieldsPnUpdateModel): Observable<OperationResult> {
    return this.put(CustomerPnFieldsMethods.CustomerPnFields, model);
  }
}
