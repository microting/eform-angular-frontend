import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {AppointmentModel, AppointmentsListModel} from '../models';
import {AppointmentRequestModel} from '../models/appointment-pn-request.model';

export let AppointmentCalendarMethods = {
  AppointmentCalendar: 'api/appointment-pn/appointments'
};
@Injectable()
export class AppointmentPnCalendarService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAppointmentsList(model: AppointmentRequestModel): Observable<OperationDataResult<AppointmentsListModel>> {
    return this.get(AppointmentCalendarMethods.AppointmentCalendar, model);
  }

  getAppointment(id: number | string): Observable<OperationDataResult<AppointmentModel>> {
    return this.get(AppointmentCalendarMethods.AppointmentCalendar + '/' + id);
  }

  updateAppointment(model: AppointmentModel): Observable<OperationResult> {
    return this.put(AppointmentCalendarMethods.AppointmentCalendar, model);
  }

  createAppointment(model: AppointmentModel): Observable<OperationResult> {
    return this.post(AppointmentCalendarMethods.AppointmentCalendar, model);
  }

  deleteAppointment(id: number | string): Observable<OperationResult> {
    return this.delete(AppointmentCalendarMethods.AppointmentCalendar + '/' + id);
  }
}
