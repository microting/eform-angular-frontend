import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {
  InnerResourcesPnRequestModel,
  InnerResourcesPnModel,
  OuterResourcesPnModel,
  OuterResourcesPnRequestModel,
  InnerResourcePnModel
} from '../../../models';
import {OuterInnerResourcePnOuterResourceService, OuterInnerResourcePnInnerResourceService} from '../../../services';
import {SharedPnService} from '../../../../shared/services';
import {AuthService} from '../../../../../../common/services/auth';
import {PluginClaimsHelper} from '../../../../../../common/helpers';
import {OuterInnerResourcePnClaims} from '../../../enums';

@Component({
  selector: 'app-machine-area-pn-machines-page',
  templateUrl: './inner-resources-page.component.html',
  styleUrls: ['./inner-resources-page.component.scss']
})
export class InnerResourcesPageComponent implements OnInit {
  @ViewChild('createMachineModal', {static: false}) createMachineModal;
  @ViewChild('editMachineModal', {static: false}) editMachineModal;
  @ViewChild('deleteMachineModal', {static: false}) deleteMachineModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  machinesModel: InnerResourcesPnModel = new InnerResourcesPnModel();
  machinesRequestModel: InnerResourcesPnRequestModel = new InnerResourcesPnRequestModel();
  mappingAreas: OuterResourcesPnModel = new OuterResourcesPnModel();
  name: string;

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get outerInnerResourcePnClaims() {
    return OuterInnerResourcePnClaims;
  }

  constructor(private sharedPnService: SharedPnService,
              private machineAreaPnMachinesService: OuterInnerResourcePnInnerResourceService,
              private authService: AuthService,
              private machineAreaPnAreasService: OuterInnerResourcePnOuterResourceService) { }
  get currentRole(): string {
    return this.authService.currentRole;
  }
  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('machinesPnSettings', 'InnerResources').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('machinesPnSettings', this.localPageSettings, 'InnerResources');
    this.getLocalPageSettings();
  }

  getAllInitialData() {
    this.getAllMachines();
    this.getMappedAreas();
  }

  getAllMachines() {
    this.machinesRequestModel.pageSize = this.localPageSettings.pageSize;
    this.machinesRequestModel.sort = this.localPageSettings.sort;
    this.machinesRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.machineAreaPnMachinesService.getAllMachines(this.machinesRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.machinesModel = data.model;
      }
    });
  }

  getMappedAreas() {
    this.machineAreaPnAreasService.getAllAreas(new OuterResourcesPnRequestModel()).subscribe((data) => {
      if (data && data.success) {
        this.mappingAreas = data.model;
      }
    });
  }

  showEditMachineModal(machine: InnerResourcePnModel) {
    this.editMachineModal.show(machine);
  }

  showDeleteMachineModal(machine: InnerResourcePnModel) {
    this.deleteMachineModal.show(machine);
  }

  showCreateMachineModal() {
    this.createMachineModal.show();
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.machinesRequestModel.offset = e;
      if (e === 0) {
        this.machinesRequestModel.pageIndex = 0;
      } else {
        this.machinesRequestModel.pageIndex
          = Math.floor(e / this.machinesRequestModel.pageSize);
      }
      this.getAllMachines();
    }
  }
}
