import {Component, OnInit, ViewChild} from '@angular/core';
import {SiteDto} from '../../../../models/dto/site.dto';
import {SimpleSitesService} from '../../../../services/simple-sites.service';
import {NotifyService} from '../../../helpers/helpers.module';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Router} from '@angular/router';
import {SimpleSiteModel} from '../../../../models/simpleSite/simple-site.model';
import {UnitsService} from '../../../../services/units.service';

@Component({
  selector: 'app-simple-sites-table',
  templateUrl: './simple-sites-table.component.html',
  styleUrls: ['./simple-sites-table.component.css']
})
export class SimpleSitesTableComponent implements OnInit {
  @ViewChild('deleteSimpleSiteModal')
  deleteSimpleSiteModal: ModalComponent;
  @ViewChild('createSimpleSiteModal')
  createSimpleSiteModal: ModalComponent;
  @ViewChild('otpRequestModal')
  otpRequestModal: ModalComponent;
  selectedSimpleSite: SiteDto = new SiteDto;
  simpleSiteModel: SimpleSiteModel = new SimpleSiteModel;
  spinnerStatus = true;
  sitesDto: Array<SiteDto>;

  constructor(private simpleSitesService: SimpleSitesService, private notifyService: NotifyService, private router: Router, private unitsService: UnitsService) {
  }

  ngOnInit() {
    this.loadAllSimpleSites();
  }

  loadAllSimpleSites() {
    this.spinnerStatus = true;
    this.simpleSitesService.getAllSimpleSites().subscribe(operation => {
      if (operation && operation.success) {
        this.sitesDto = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  deleteSingle(id: number) {
    this.simpleSitesService.deleteSingleSimpleSite(id).subscribe(operation => {
      if (operation && operation.success) {
        this.loadAllSimpleSites();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.deleteSimpleSiteModal.close();
    });
  }

  showDeleteSimpleSiteModal(simpleSiteDto: SiteDto) {
    this.selectedSimpleSite = simpleSiteDto;
    this.deleteSimpleSiteModal.open();
  }

  deleteSimpleSite(id: number) {
    this.deleteSingle(id);
    this.deleteSimpleSiteModal.close();
  }

  createSimpleSite() {
    this.simpleSitesService.createSingleSimpleSite(this.simpleSiteModel).subscribe(operation => {
      if (operation && operation.success) {
        this.loadAllSimpleSites();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
      this.createSimpleSiteModal.close();
    });
  }

  showCreateSimpleSiteModal() {
    this.createSimpleSiteModal.open();
  }

  requestOtp(id: number) {
    this.spinnerStatus = true;
    this.unitsService.requestOtp(id).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.loadAllSimpleSites();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

  showRequestOtpModal(siteDto: SiteDto) {
    if (!siteDto.unitId) {
      return;
    }
    this.selectedSimpleSite = siteDto;
    this.otpRequestModal.open();
  }

  saveRequestOtpModal() {
    this.requestOtp(this.selectedSimpleSite.unitId);
    this.otpRequestModal.close();
  }
}
