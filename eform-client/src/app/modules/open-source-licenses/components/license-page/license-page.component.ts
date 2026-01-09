import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

interface LicenseInfo {
  name: string;
  version: string;
  license: string;
  repository: string;
  licenseUrl?: string;
  licenseText?: string;
  loading?: boolean;
  error?: string;
}

@Component({
  selector: 'app-license-page',
  standalone: true,
  templateUrl: './license-page.component.html',
  styleUrls: ['./license-page.component.scss'],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    TranslateModule
  ]
})
export class LicensePageComponent implements OnInit {
  licenses: LicenseInfo[] = [
    // Angular packages - MIT License
    { name: '@angular/animations', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    { name: '@angular/cdk', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/components', licenseUrl: 'https://raw.githubusercontent.com/angular/components/main/LICENSE' },
    { name: '@angular/common', version: '20.3.14', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    { name: '@angular/compiler', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    { name: '@angular/core', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    { name: '@angular/forms', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    { name: '@angular/material', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/components', licenseUrl: 'https://raw.githubusercontent.com/angular/components/main/LICENSE' },
    { name: '@angular/router', version: '20.1.2', license: 'MIT', repository: 'https://github.com/angular/angular', licenseUrl: 'https://raw.githubusercontent.com/angular/angular/main/LICENSE' },
    
    // NgRx - MIT License
    { name: '@ngrx/store', version: '19.2.1', license: 'MIT', repository: 'https://github.com/ngrx/platform', licenseUrl: 'https://raw.githubusercontent.com/ngrx/platform/main/LICENSE' },
    { name: '@ngrx/effects', version: '19.2.1', license: 'MIT', repository: 'https://github.com/ngrx/platform', licenseUrl: 'https://raw.githubusercontent.com/ngrx/platform/main/LICENSE' },
    { name: '@ngrx/entity', version: '19.2.1', license: 'MIT', repository: 'https://github.com/ngrx/platform', licenseUrl: 'https://raw.githubusercontent.com/ngrx/platform/main/LICENSE' },
    
    // Other major dependencies
    { name: 'rxjs', version: '7.8.2', license: 'Apache-2.0', repository: 'https://github.com/ReactiveX/rxjs', licenseUrl: 'https://raw.githubusercontent.com/ReactiveX/rxjs/master/LICENSE.txt' },
    { name: 'd3', version: '7.9.0', license: 'ISC', repository: 'https://github.com/d3/d3', licenseUrl: 'https://raw.githubusercontent.com/d3/d3/main/LICENSE' },
    { name: 'moment', version: '2.30.1', license: 'MIT', repository: 'https://github.com/moment/moment', licenseUrl: 'https://raw.githubusercontent.com/moment/moment/develop/LICENSE' },
    { name: 'luxon', version: '3.7.2', license: 'MIT', repository: 'https://github.com/moment/luxon', licenseUrl: 'https://raw.githubusercontent.com/moment/luxon/master/license.md' },
    { name: 'date-fns', version: '4.1.0', license: 'MIT', repository: 'https://github.com/date-fns/date-fns', licenseUrl: 'https://raw.githubusercontent.com/date-fns/date-fns/main/LICENSE.md' },
    { name: 'ramda', version: '0.32.0', license: 'MIT', repository: 'https://github.com/ramda/ramda', licenseUrl: 'https://raw.githubusercontent.com/ramda/ramda/master/LICENSE.txt' },
    { name: 'uuid', version: '13.0.0', license: 'MIT', repository: 'https://github.com/uuidjs/uuid', licenseUrl: 'https://raw.githubusercontent.com/uuidjs/uuid/main/LICENSE.md' },
    { name: 'file-saver', version: '2.0.5', license: 'MIT', repository: 'https://github.com/eligrey/FileSaver.js', licenseUrl: 'https://raw.githubusercontent.com/eligrey/FileSaver.js/master/LICENSE.md' },
    { name: 'pdf-lib', version: '1.16.0', license: 'MIT', repository: 'https://github.com/Hopding/pdf-lib', licenseUrl: 'https://raw.githubusercontent.com/Hopding/pdf-lib/master/LICENSE.md' },
    { name: 'ngx-toastr', version: '19.1.0', license: 'MIT', repository: 'https://github.com/scttcper/ngx-toastr', licenseUrl: 'https://raw.githubusercontent.com/scttcper/ngx-toastr/master/LICENSE' },
    
    // .NET packages - various licenses
    { name: 'Microsoft.AspNetCore.Authentication.JwtBearer', version: '10.0.1', license: 'MIT', repository: 'https://github.com/dotnet/aspnetcore', licenseUrl: 'https://raw.githubusercontent.com/dotnet/aspnetcore/main/LICENSE.txt' },
    { name: 'Microsoft.EntityFrameworkCore', version: '10.0.1', license: 'MIT', repository: 'https://github.com/dotnet/efcore', licenseUrl: 'https://raw.githubusercontent.com/dotnet/efcore/main/LICENSE.txt' },
    { name: 'Swashbuckle.AspNetCore', version: '10.1.0', license: 'MIT', repository: 'https://github.com/domaindrivendev/Swashbuckle.AspNetCore', licenseUrl: 'https://raw.githubusercontent.com/domaindrivendev/Swashbuckle.AspNetCore/master/LICENSE' },
    { name: 'Sentry', version: '6.0.0', license: 'MIT', repository: 'https://github.com/getsentry/sentry-dotnet', licenseUrl: 'https://raw.githubusercontent.com/getsentry/sentry-dotnet/main/LICENSE' },
    { name: 'sendgrid', version: '9.29.3', license: 'MIT', repository: 'https://github.com/sendgrid/sendgrid-csharp', licenseUrl: 'https://raw.githubusercontent.com/sendgrid/sendgrid-csharp/main/LICENSE' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Sort licenses by name
    this.licenses.sort((a, b) => a.name.localeCompare(b.name));
  }

  onPanelOpened(license: LicenseInfo): void {
    if (!license.licenseText && !license.loading && !license.error && license.licenseUrl) {
      license.loading = true;
      this.http.get(license.licenseUrl, { responseType: 'text' }).subscribe({
        next: (text) => {
          license.licenseText = text;
          license.loading = false;
        },
        error: (err) => {
          license.error = 'Failed to load license text. Please visit the repository.';
          license.loading = false;
        }
      });
    }
  }
}
