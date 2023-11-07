import { Component, Input} from '@angular/core';
import { format } from 'date-fns';
import { FieldValueDto } from 'src/app/common/models';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import {AuthStateService} from 'src/app/common/store';
import {selectCurrentUserLocale, selectIsDarkMode} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'element-date',
  templateUrl: './element-date.component.html',
  styleUrls: ['./element-date.component.scss'],
})
export class ElementDateComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);

  constructor(
    private authStore: Store,
    dateTimeAdapter: DateTimeAdapter<any>, private authStateService: AuthStateService
  ) {
    this.selectCurrentUserLocale$.subscribe((locale) => {
      dateTimeAdapter.setLocale(locale);
    });
    // dateTimeAdapter.setLocale(authStateService.currentUserLocale);
  }

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  onDateSelected(e: any) {
    this.fieldValueObj.value = format(e.value, 'yyyy-MM-dd');
  }
}
