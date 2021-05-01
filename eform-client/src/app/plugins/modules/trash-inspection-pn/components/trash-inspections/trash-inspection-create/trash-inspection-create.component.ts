import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  TrashInspectionPnFractionsService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnSegmentsService,
  TrashInspectionPnSettingsService,
  TrashInspectionPnTransporterService,
  TrashInspectionPnTrashInspectionsService,
} from '../../../services';
import {
  FractionPnModel,
  FractionPnRequestModel,
  InstallationPnRequestModel,
  InstallationsPnModel,
  ProducerPnRequestModel,
  ProducersPnModel,
  SegmentPnRequestModel,
  SegmentsPnModel,
  TransporterPnRequestModel,
  TransportersPnModel,
  TrashInspectionBaseSettingsModel,
  TrashInspectionPnModel,
} from '../../../models';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EFormService } from 'src/app/common/services/eform';
import { Paged } from 'src/app/common/models';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-create',
  templateUrl: './trash-inspection-create.component.html',
  styleUrls: ['./trash-inspection-create.component.scss'],
})
export class TrashInspectionCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output()
  onTrashInspectionCreated: EventEmitter<void> = new EventEmitter<void>();
  transportersModel: TransportersPnModel = new TransportersPnModel();
  producersModel: ProducersPnModel = new ProducersPnModel();
  installationsModel: InstallationsPnModel = new InstallationsPnModel();
  fractionsModel: Paged<FractionPnModel> = new Paged<FractionPnModel>();
  segmentsModel: SegmentsPnModel = new SegmentsPnModel();
  producerRequestModel: ProducerPnRequestModel = new ProducerPnRequestModel();
  transporterRequestModel: TransporterPnRequestModel = new TransporterPnRequestModel();
  fractionRequestModel: FractionPnRequestModel = new FractionPnRequestModel();
  segmentRequestModel: SegmentPnRequestModel = new SegmentPnRequestModel();
  checked = false;
  dateNow = new Date();
  timeNow = new Date();
  token: string;
  settingsModel: TrashInspectionBaseSettingsModel = new TrashInspectionBaseSettingsModel();
  newTrashInspectionModel: TrashInspectionPnModel = new TrashInspectionPnModel();
  installationRequestModel: InstallationPnRequestModel = new InstallationPnRequestModel();
  typeaheadInstallation = new EventEmitter<string>();
  typeaheadProducer = new EventEmitter<string>();
  typeaheadTransporter = new EventEmitter<string>();
  typeaheadFraction = new EventEmitter<string>();
  typeaheadSegment = new EventEmitter<string>();

  constructor(
    private InstallationsService: TrashInspectionPnInstallationsService,
    private trashInspectionPnSettingsService: TrashInspectionPnSettingsService,
    private segmentsService: TrashInspectionPnSegmentsService,
    private eFormService: EFormService,
    private installationsService: TrashInspectionPnInstallationsService,
    private producersService: TrashInspectionPnProducersService,
    private transportersService: TrashInspectionPnTransporterService,
    private fractionsService: TrashInspectionPnFractionsService,
    private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService,
    private cd: ChangeDetectorRef
  ) {
    this.typeaheadInstallation
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          return this.installationsService.getAllInstallations(
            this.installationRequestModel
          );
        })
      )
      .subscribe((items) => {
        this.installationsModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadProducer
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.producerRequestModel.nameFilter = term;
          return this.producersService.getAllProducers(
            this.producerRequestModel
          );
        })
      )
      .subscribe((items) => {
        this.producersModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadTransporter
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          this.transporterRequestModel.nameFilter = term;
          return this.transportersService.getAllTransporters(
            this.transporterRequestModel
          );
        })
      )
      .subscribe((items) => {
        this.transportersModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadFraction
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          return this.fractionsService.getAllFractions(
            this.fractionRequestModel
          );
        })
      )
      .subscribe((items) => {
        this.fractionsModel = items.model;
        this.cd.markForCheck();
      });
    this.typeaheadSegment
      .pipe(
        debounceTime(200),
        switchMap((term) => {
          return this.segmentsService.getAllSegments(this.segmentRequestModel);
        })
      )
      .subscribe((items) => {
        this.segmentsModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.getToken();
  }

  show() {
    this.frame.show();
  }

  getToken() {
    this.trashInspectionPnSettingsService.getToken().subscribe((data) => {
      if (data && data.success) {
        this.token = data.model;
      }
    });
  }

  // getSettings() {
  //   this.spinnerStatus = true;
  //   debugger;
  //   this.trashInspectionPnSettingsService.getAllSettings().subscribe((data) => {
  //     if (data && data.success) {
  //       this.settingsModel = data.model;
  //     }
  //   });
  // }

  createTrashInspection() {
    this.newTrashInspectionModel.token = this.token;
    this.newTrashInspectionModel.date = this.dateNow;
    this.newTrashInspectionModel.time = this.timeNow;
    this.trashInspectionPnTrashInspectionsService
      .createTrashInspection(this.newTrashInspectionModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onTrashInspectionCreated.emit();
          this.newTrashInspectionModel = new TrashInspectionPnModel();
          this.frame.hide();
        }
      });
  }
  addToArray(e: any, installationId: number) {
    if (e.target.checked) {
      this.newTrashInspectionModel.relatedAreasIds.push(installationId);
    } else {
      this.newTrashInspectionModel.relatedAreasIds = this.newTrashInspectionModel.relatedAreasIds.filter(
        (x) => x !== installationId
      );
    }
  }
  onInstallationSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.installationName = e.name;
  }
  onProducerSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.producer = e.name;
  }
  onTransporterSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.transporter = e.name;
  }
  onFractionSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.trashFraction = Number(e.itemNumber);
  }
  onSegmentSelectedChanged(e: any) {
    // debugger;
    this.newTrashInspectionModel.segment = e.name;
  }
  isChecked(status: boolean) {
    this.newTrashInspectionModel.mustBeInspected = status;
  }
}
