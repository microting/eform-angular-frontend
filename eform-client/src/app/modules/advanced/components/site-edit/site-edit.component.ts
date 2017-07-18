import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifyService} from 'app/services/notify.service';
import {SitesService} from 'app/services';
import {SiteNameModel} from 'app/models/advanced';
import {SiteNameDto} from 'app/models/dto';

@Component({
  selector: 'app-site-edit',
  templateUrl: './site-edit.component.html',
  styleUrls: ['./site-edit.component.css']
})
export class SiteEditComponent implements OnInit {
  id: number;
  siteDto: SiteNameDto = new SiteNameDto();
  siteModel: SiteNameModel = new SiteNameModel();

  constructor(private sitesService: SitesService, private activateRoute: ActivatedRoute,
              private router: Router, private notifyService: NotifyService) {
    this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.getSingle();
  }

  updateSingle() {
    this.siteModel.id = this.id;
    this.sitesService.updateSingleSite(this.siteModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/advanced/sites/']).then();
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

  getSingle() {
    this.sitesService.getSingleSite(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.siteDto = operation.model;

        this.siteModel.siteName = this.siteDto.siteName;
      }
    });
  }

}
