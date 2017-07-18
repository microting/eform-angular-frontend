import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConnectionStringComponent} from './components/connection-string/connection-string.component';
import {FormsModule} from '@angular/forms';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './components/settings.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule
  ],
  declarations: [ConnectionStringComponent, SettingsComponent]
})
export class SettingsModule {
}
