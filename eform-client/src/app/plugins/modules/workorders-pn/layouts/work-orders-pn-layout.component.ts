import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import { LocaleService } from 'src/app/common/services';
import { TranslateService } from '@ngx-translate/core';
import { translates } from '../i18n/translates';

@Component({
  selector: 'app-workorders-pn-layout',
  template: '<router-outlet></router-outlet>',
})
export class WorkOrdersPnLayoutComponent implements AfterContentInit, OnInit {
  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    const lang = this.localeService.getCurrentUserLocale();
    const i18n = translates[lang];
    this.translateService.setTranslation(lang, i18n, true);
  }
}
