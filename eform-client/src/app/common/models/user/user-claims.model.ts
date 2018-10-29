export class UserClaimsModel {
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
  usersCreate: boolean;
  usersRead: boolean;
  usersUpdate: boolean;
  usersDelete: boolean;
  eFormsCreate: boolean;
  eFormsDelete: boolean;
  constructor(decodedToken: any) {
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

    this.usersCreate = decodedToken.users_create === 'True';
    this.usersRead = decodedToken.users_read === 'True';
    this.usersUpdate = decodedToken.users_update === 'True';
    this.usersDelete = decodedToken.users_delete === 'True';

    this.eFormsCreate = decodedToken.eforms_create === 'True';
    this.eFormsDelete = decodedToken.eforms_delete === 'True';
  }
}
