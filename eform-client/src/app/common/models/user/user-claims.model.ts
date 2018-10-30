export class UserClaimsModel {
  unitsRead: boolean;
  unitsUpdate: boolean;
  workersCreate: boolean;
  workersRead: boolean;
  workersUpdate: boolean;
  workersDelete: boolean;
  sitesCreate: boolean;
  sitesRead: boolean;
  sitesUpdate: boolean;
  sitesDelete: boolean;
  entitySearchCreate: boolean;
  entitySearchRead: boolean;
  entitySearchUpdate: boolean;
  entitySearchDelete: boolean;
  entitySelectCreate: boolean;
  entitySelectRead: boolean;
  entitySelectUpdate: boolean;
  entitySelectDelete: boolean;
  deviceUsersCreate: boolean;
  deviceUsersRead: boolean;
  deviceUsersUpdate: boolean;
  deviceUsersDelete: boolean;
  usersCreate: boolean;
  usersRead: boolean;
  usersUpdate: boolean;
  usersDelete: boolean;
  eFormsCreate: boolean;
  eFormsDelete: boolean;
  eFormsRead: boolean;
  eFormsUpdateColumns: boolean;
  eFormsDownloadXml: boolean;
  eFormsUploadZip: boolean;
  eFormsCaseRead: boolean;
  eFormsCasesRead: boolean;
  eFormsCasesUpdate: boolean;
  eFormsCasesDelete: boolean;
  eFormsGetPdf: boolean;
  eFormsPairingRead: boolean;
  eFormsPairingUpdate: boolean;
  eFormsReadTags: boolean;
  eFormsUpdateTags: boolean;
  eFormsGetCsv: boolean;

  constructor(decodedToken: any) {
    this.unitsRead = decodedToken.units_read === 'True';
    this.unitsUpdate = decodedToken.units_update === 'True';

    this.workersCreate = decodedToken.workers_create === 'True';
    this.workersRead = decodedToken.workers_read === 'True';
    this.workersUpdate = decodedToken.workers_update === 'True';
    this.workersDelete = decodedToken.workers_delete === 'True';

    this.sitesCreate = decodedToken.sites_create === 'True';
    this.sitesRead = decodedToken.sites_read === 'True';
    this.sitesUpdate = decodedToken.sites_update === 'True';
    this.sitesDelete = decodedToken.sites_delete === 'True';

    this.entitySearchCreate = decodedToken.entity_search_create === 'True';
    this.entitySearchRead = decodedToken.entity_search_read === 'True';
    this.entitySearchUpdate = decodedToken.entity_search_update === 'True';
    this.entitySearchDelete = decodedToken.entity_search_delete === 'True';

    this.entitySelectCreate = decodedToken.entity_select_create === 'True';
    this.entitySelectRead = decodedToken.entity_select_read === 'True';
    this.entitySelectUpdate = decodedToken.entity_select_update === 'True';
    this.entitySelectDelete = decodedToken.entity_select_delete === 'True';

    this.deviceUsersCreate = decodedToken.device_users_create === 'True';
    this.deviceUsersRead = decodedToken.device_users_read === 'True';
    this.deviceUsersUpdate = decodedToken.device_users_update === 'True';
    this.deviceUsersDelete = decodedToken.device_users_delete === 'True';

    this.usersCreate = decodedToken.users_create === 'True';
    this.usersRead = decodedToken.users_read === 'True';
    this.usersUpdate = decodedToken.users_update === 'True';
    this.usersDelete = decodedToken.users_delete === 'True';

    this.eFormsCreate = decodedToken.eforms_create === 'True';
    this.eFormsDelete = decodedToken.eforms_delete === 'True';
    this.eFormsRead = decodedToken.eforms_read === 'True';
    this.eFormsUpdateColumns = decodedToken.eforms_update_columns === 'True';
    this.eFormsDownloadXml = decodedToken.eforms_download_xml === 'True';
    this.eFormsUploadZip = decodedToken.eforms_upload_zip === 'True';
    this.eFormsCaseRead = decodedToken.eforms_case_read === 'True';
    this.eFormsCasesRead = decodedToken.eforms_cases_read === 'True';
    this.eFormsCasesUpdate = decodedToken.eforms_cases_update === 'True';
    this.eFormsCasesDelete = decodedToken.eforms_cases_delete === 'True';
    this.eFormsGetPdf = decodedToken.eforms_get_pdf === 'True';
    this.eFormsPairingRead = decodedToken.eforms_pairing_read === 'True';
    this.eFormsPairingUpdate = decodedToken.eforms_pairing_update === 'True';
    this.eFormsReadTags = decodedToken.eforms_read_tags === 'True';
    this.eFormsUpdateTags = decodedToken.eforms_update_tags === 'True';
    this.eFormsGetCsv = decodedToken.eforms_get_csv === 'True';
  }
}
