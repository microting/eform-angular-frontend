import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AppointmentFieldModel, AppointmentModel} from '../../../models';
import {AppointmentPnCalendarService} from '../../../services';
import * as moment from 'moment';
import {debounceTime, switchMap} from 'rxjs/operators';
import {TemplateListModel, TemplateRequestModel} from '../../../../../../common/models/eforms';
import {EFormService} from '../../../../../../common/services/eform';
import {FieldValueDto, SiteNameDto, TemplateDto} from '../../../../../../common/models/dto';
import {SitesService} from '../../../../../../common/services/advanced';
import {AuthService} from '../../../../../../common/services/auth';
import {FieldDto} from '../../../../../../common/models/dto/field.dto';
import {DateTimeAdapter} from 'ng-pick-datetime-ex';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss']
})
export class AppointmentEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() appointmentSaved: EventEmitter<void> = new EventEmitter<void>();
  selectedModel: AppointmentModel = new AppointmentModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  templatesModel: TemplateListModel = new TemplateListModel();
  selectedTemplate: TemplateDto = new TemplateDto();
  pairingSites: {site: SiteNameDto, deploy: boolean}[] = [];
  fields: FieldDto[] = [];
  typeahead = new EventEmitter<string>();

  constructor(
    private appointmentPnCalendarService: AppointmentPnCalendarService,
    private eFormService: EFormService,
    private sitesService: SitesService,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    dateTimeAdapter.setLocale(localStorage.getItem('locale'));
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
  }

  onClose() {
    this.selectedModel = new AppointmentModel();
    this.frame.hide();
  }

  onTemplateChange() {
    this.updateSelectedTemplate();
  }

  show(model?: AppointmentModel) {
    this.templatesModel = new TemplateListModel();

    if (model) {
      this.selectedModel = model;
      this.selectedModel.startAt = moment(model.startAt).utc(true).local();
      this.selectedModel.expireAt = moment(model.expireAt).utc(true).local();
      this.selectedModel.repeatUntil = model.repeatUntil ? moment(model.repeatUntil).utc(true).local() : null;
      this.updateSelectedTemplate();
    } else {
      this.selectedTemplate = null;
      this.selectedModel.colorHex = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    this.updateSites();
    this.frame.show();
  }

  saveAppointment() {
    if (!this.selectedModel.title || !this.selectedModel.startAt || !this.selectedModel.expireAt) {
      return;
    }
    this.selectedModel.startAt.utcOffset(0, false);

    if (this.selectedModel.expireAt) {
      this.selectedModel.expireAt.utcOffset(0, false);
    }

    this.selectedModel.siteUids = this.pairingSites.filter(s => s.deploy).map(s => s.site.siteUId);
    this.selectedModel.fields = this.fields.map<AppointmentFieldModel>(f => ({fieldId: f.id, fieldValue: f.fieldValues[0].value}));

    if (this.selectedModel.id) {
      this.appointmentPnCalendarService.updateAppointment(this.selectedModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.appointmentSaved.emit();
            this.selectedModel = new AppointmentModel();
            this.frame.hide();
          }
        });
    } else {
      this.appointmentPnCalendarService.createAppointment(this.selectedModel)
        .subscribe((data) => {
          if (data && data.success) {
            this.appointmentSaved.emit();
            this.selectedModel = new AppointmentModel();
            this.frame.hide();
          }

        });
    }
  }

  updateSites() {
    if (this.authService.userClaims.eformsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe(operation => {
        if (operation && operation.success) {
          this.pairingSites = operation.model.map(dto => ({site: dto, deploy: this.selectedModel.siteUids.some(s => s === dto.siteUId)}));
        }
      });
    }
  }

  updateSelectedTemplate() {
    if (!this.selectedModel.eFormId) {
      return;
    }

    this.eFormService.getSingle(this.selectedModel.eFormId).subscribe(operation => {
      if (operation && operation.success) {
        this.selectedTemplate = operation.model;
        this.templatesModel.numOfElements = 1;
        this.templatesModel.templates = [this.selectedTemplate];
        this.cd.markForCheck();
      }
    });

    this.eFormService.getFields(this.selectedModel.eFormId).subscribe(operation => {
      if (operation && operation.success) {
        this.fields = [];

        for (const field of operation.model) {
          const fieldValue = new FieldValueDto();
          const appointmentField = this.selectedModel.fields && this.selectedModel.fields.find(x => x.fieldId === field.id);

          if (appointmentField) {
            fieldValue.value = appointmentField.fieldValue;

            if (Array.isArray(field.keyValuePairList)) {
              const pair = field.keyValuePairList.find(x => x.key === appointmentField.fieldValue);
              fieldValue.valueReadable = pair ? pair.value : null;
            }
          } else {
            fieldValue.value = '';
          }

          fieldValue.keyValuePairList = field.keyValuePairList;

          field.fieldValues = [fieldValue];
          field.dataItemList = [];
          this.fields.push(field);
        }
      }
    });
  }
}
