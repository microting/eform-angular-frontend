import {Injectable} from '@angular/core';

@Injectable()
export class Configuration {
}

export let UnitsMethods = {
  GetAll: '/api/units/index',
  RequestOtp: '/api/units/requestotp'
};

export let WorkersMethods = {
  GetAll: '/api/workers/index',
  GetSingle: '/api/workers/edit',
  UpdateSingle: '/api/workers/update',
  DeleteSingle: '/api/workers/delete'
};

export let SitesMethods = {
  GetAll: '/api/sites/index',
  GetSingle: '/api/sites/edit',
  UpdateSingle: '/api/sites/update',
  DeleteSingle: '/api/sites/delete'
};

export let SimpleSitesMethods = {
  GetAll: '/api/simplesites/index',
  GetSingle: '/api/simplesites/edit',
  UpdateSingle: '/api/simplesites/update',
  DeleteSingle: '/api/simplesites/delete',
  CreateSingle: '/api/simplesites/create'
};

export let SettingsMethods = {
  UpdateConnectionString: '/api/settings/connectionstring'
};

export let TemplatesMethods = {
  GetAll: '/api/templates/index',
  DeleteSingle: '/api/templates/delete',
  CreateSingle: '/api/templates/create',
  DeploySingle: '/api/templates/deploy',
  GetCsv: '/api/templates/csv'
};

export let CasesMethods = {
  EditById: '/api/cases/edit',
  GetCases: '/api/cases/index',
  UpdateCase: '/api/cases/update'
};

export let AdvSearchableEntityMethods = {
  GetAll: '/api/searchable-groups',
  GetSingle: '/api/searchable-groups/get',
  DeleteSingle: '/api/searchable-groups/delete',
  CreateSingle: '/api/searchable-groups/create',
  UpdateSingle: '/api/searchable-groups/update',
  ImportGroup: '/api/searchable-groups/import'
};
