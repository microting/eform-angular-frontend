import {HelpersModule, NotifyService} from './modules/helpers/helpers.module';
import {AppRoutingModule} from './app.routing';
import {AdvancedModule} from 'app/modules/advanced/advanced.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './components/app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {FullLayoutComponent} from './layouts/fulllayout/fulllayout.component';
import {SettingsModule} from './modules/settings/settings.module';
import {DndModule} from 'ng2-dnd';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    FullLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AdvancedModule,
    HttpModule,
    SettingsModule,
    HelpersModule,
    BrowserAnimationsModule,
    DndModule.forRoot()
  ],
  providers: [NotifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
