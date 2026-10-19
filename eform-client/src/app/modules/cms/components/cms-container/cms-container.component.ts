import {Component} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {CmsSettingsComponent} from '../cms-settings/cms-settings.component';
import {CmsPagesListComponent} from '../cms-pages-list/cms-pages-list.component';
import {CmsMenusListComponent} from '../cms-menus-list/cms-menus-list.component';

@Component({
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatTabGroup, MatTab, CmsSettingsComponent, CmsPagesListComponent, CmsMenusListComponent],
  selector: 'app-cms-container',
  templateUrl: './cms-container.component.html',
})
export class CmsContainerComponent {}
