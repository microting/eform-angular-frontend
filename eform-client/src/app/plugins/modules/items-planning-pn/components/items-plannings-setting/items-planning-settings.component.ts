import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import { ItemsPlanningPnSettingsService} from '../../services';
import {Router} from '@angular/router';
import {debounceTime, switchMap} from 'rxjs/operators';
import {EntitySearchService} from '../../../../../common/services/advanced';
import {TemplateListModel, TemplateRequestModel} from '../../../../../common/models/eforms';
import {EFormService} from '../../../../../common/services/eform';
import {ItemsPlanningBaseSettingsModel} from '../../models/items-planning-base-settings.model';
import {FileItem, FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import {UUID} from 'angular2-uuid';
import {AuthService} from 'src/app/common/services';

@Component({
  selector: 'app-items-planning-settings',
  templateUrl: './items-planning-settings.component.html',
  styleUrls: ['./items-planning-settings.component.scss']
})
export class ItemsPlanningSettingsComponent implements OnInit {
  loginPageImageUploader: FileUploader = new FileUploader(
      {url: 'api/items-planning-pn/report-page-image'}
  );
  typeahead = new EventEmitter<string>();
  settingsModel: ItemsPlanningBaseSettingsModel = new ItemsPlanningBaseSettingsModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  headerImageLink: string;

  constructor(
    private itemsPlanningPnSettingsService: ItemsPlanningPnSettingsService,
    private router: Router,
    private eFormService: EFormService,
    private entitySearchService: EntitySearchService,
    private authService: AuthService,
    private cd: ChangeDetectorRef) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.getSettings();
    this.initializeUploaders();
    const authHeader: Array<{
      name: string;
      value: string;
    }> = [];
    authHeader.push({name: 'Authorization', value: this.authService.bearerToken});
    const uploadOptions = <FileUploaderOptions>{headers : authHeader};
    this.loginPageImageUploader.setOptions(uploadOptions);
  }

  getSettings() {
    this.itemsPlanningPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
        if (this.settingsModel.reportImageName) {
          this.headerImageLink = 'api/images/eform-images?fileName=' + this.settingsModel.reportImageName;
        } else {
          this.headerImageLink = '../../../assets/images/logo.png';
        }
      }
    });
  }

  resetImage() {
    this.headerImageLink = '../../../assets/images/logo.png';
    this.settingsModel.reportImageName = '';
  }

  updateSettings() {
    if (this.loginPageImageUploader.queue.length > 0) {
      this.loginPageImageUploader.queue[0].upload();
    }
    this.itemsPlanningPnSettingsService.updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {

        }
      });
  }

  initializeUploaders() {
    // TODO: REWORK
    const re = /(?:\.([^.]+))?$/;
    this.loginPageImageUploader.onAfterAddingFile = f => {
      if (this.loginPageImageUploader.queue.length > 1) {
        this.loginPageImageUploader.removeFromQueue(this.loginPageImageUploader.queue[0]);
      }
    };
    this.loginPageImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach(fileItem => {
        fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
        this.settingsModel.reportImageName = fileItem.file.name;
      });
    };
    // this.headerImageUploader.onAfterAddingAll = (files: FileItem[]) => {
    //   files.forEach(fileItem => {
    //     fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
    //     this.adminSettingsModel.headerSettingsModel.imageLink = fileItem.file.name;
    //   });
    // };
  }
}
