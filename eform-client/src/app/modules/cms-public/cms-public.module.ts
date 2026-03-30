import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {CmsHeaderComponent} from './components/cms-header/cms-header.component';
import {CmsMenuItemComponent} from './components/cms-menu-item/cms-menu-item.component';
import {CmsPageViewComponent} from './components/cms-page-view/cms-page-view.component';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: ':slug', component: CmsPageViewComponent},
];

@NgModule({
  declarations: [
    LandingPageComponent,
    CmsHeaderComponent,
    CmsMenuItemComponent,
    CmsPageViewComponent,
    SafeHtmlPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
  ],
})
export class CmsPublicModule {}
