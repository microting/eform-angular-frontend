import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LocaleService} from '../../../../common/services/auth';
import {TranslateService} from '@ngx-translate/core';
import {SharedPnService} from '../../shared/services';
import {MonitoringPnLocalSettings} from '../const/enums/monitoring-pn-local-settings.const';
declare var require: any;

@Component({
  selector: 'app-monitoring-pn-layout',
  template: '<router-outlet></router-outlet>'
})
export class MonitoringPnLayoutComponent implements  AfterViewInit, OnInit {
  constructor(private localeService: LocaleService,
              private translateService: TranslateService,
              private sharedPnService: SharedPnService) {
  }

  ngOnInit(): void {
    this.sharedPnService.initLocalPageSettings('monitoringPnLocalSettings', MonitoringPnLocalSettings);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const lang = this.localeService.getCurrentUserLocale();
      const i18n = require(`../i18n/${lang}.json`);
      this.translateService.setTranslation(lang, i18n, true);
    }, 1000);
  }
}
