
export let UnitsMethods = {
  GetAll: '/api/units/index',
  RequestOtp: '/api/units/requestotp'
};

export let WorkersMethods = {
  GetAll: '/api/workers/index',
  GetSingle: '/api/workers/edit',
  UpdateSingle: '/api/workers/update',
  CreateSingle: '/api/workers/create',
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
  UpdateConnectionString: '/api/settings/connection-string',
  ConnectionStringExist: '/api/settings/connection-string-exist',
  GetAdminSettings: '/api/settings/admin',
  ResetLoginPageSettings: '/api/settings/reset-login-page',
  ResetHeaderSettings: '/api/settings/reset-page-header',
  GetLoginPageSettings: '/api/settings/login-page',
  GetHeaderSettings: '/api/settings/page-header',
  GetAnonymousImage: 'api/images/login-page-images',
  GetAuthorizedImage: 'api/images/eform-images'
};

export let TemplatesMethods = {
  GetAll: '/api/templates/index',
  GetSingle: '/api/templates/get',
  DeleteSingle: '/api/templates/delete',
  CreateSingle: '/api/templates/create',
  DeploySingle: '/api/templates/deploy',
};

export let TemplateTagMethods = {
  Tags: 'api/tags'
};

export let TemplateFilesMethods = {
  GetCsv: '/api/template-files/csv',
  DownloadXML: '/api/template-files/download-eform-xml',
  DownloadPDF: '/api/template-files/download-case-pdf'
};

export let TemplateColumnMethods = {
  GetColumns: '/api/template-columns'
};

export let CasesMethods = {
  EditById: '/api/cases/edit',
  GetCases: '/api/cases/index',
  UpdateCase: '/api/cases/update',
  DeleteCase: '/api/cases/delete'
};

export let AdvSearchableEntityMethods = {
  GetAll: '/api/searchable-groups',
  GetSingle: '/api/searchable-groups/get',
  DeleteSingle: '/api/searchable-groups/delete',
  CreateSingle: '/api/searchable-groups/create',
  UpdateSingle: '/api/searchable-groups/update',
  ImportGroup: '/api/searchable-groups/import'
};

export let AdvSelectableEntityMethods = {
  GetAll: '/api/selectable-groups',
  GetSingle: '/api/selectable-groups/get',
  DeleteSingle: '/api/selectable-groups/delete',
  CreateSingle: '/api/selectable-groups/create',
  UpdateSingle: '/api/selectable-groups/update',
  ImportGroup: '/api/selectable-groups/import'
};

export let AdminMethods = {
  GetCurrentUser: '/api/account/user-info',
  GetUser: '/api/admin/user',
  GetAllUsers: '/api/admin/get-users',
  DeleteUser: '/api/admin/delete-user',
  CreateUser: '/api/admin/create-user',
  UpdateUser: '/api/admin/update-user'
};

export let ImageMethods = {
  Rotate: '/api/template-files/rotate-image',
  Delete: '/api/template-files/delete-image',
};
