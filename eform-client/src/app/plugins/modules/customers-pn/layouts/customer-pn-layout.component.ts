import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocaleService} from 'src/app/common/services/auth';
import {CustomersPnLocalSettings} from '../enums';
import {SharedPnService} from '../../shared/services';
declare var require: any;

@Component({
  selector: 'app-customers-pn-layout',
  template: `<router-outlet></router-outlet>`
})
export class CustomerPnLayoutComponent implements AfterViewInit, OnInit {
  constructor(private localeService: LocaleService,
              private translateService: TranslateService,
              private sharedPnService: SharedPnService
  ) {}

  ngOnInit() {
    this.sharedPnService.initLocalPageSettings('customersPnSettings', CustomersPnLocalSettings);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const lang = this.localeService.getCurrentUserLocale();
      const i18n = require(`../i18n/${lang}.json`);
      this.translateService.setTranslation(lang, i18n, true);
    }, 1000);

  }
}
