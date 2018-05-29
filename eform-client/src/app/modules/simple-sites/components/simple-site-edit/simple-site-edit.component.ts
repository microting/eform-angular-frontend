import {Component, OnInit} from '@angular/core';
import {SiteDto, SimpleSiteModel} from 'app/models';
import {SimpleSitesService, NotifyService} from 'app/services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-simple-site-edit',
  templateUrl: './simple-site-edit.component.html',
  styleUrls: ['./simple-site-edit.component.css']
})
export class SimpleSiteEditComponent implements OnInit {
  id: number;
  simpleSiteDto: SiteDto = new SiteDto;
  simpleSiteModel: SimpleSiteModel = new SimpleSiteModel;

  constructor(private simpleSitesService: SimpleSitesService, private activatedRoute: ActivatedRoute, private router: Router, private notifyService: NotifyService) {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'];
    });
  }

  ngOnInit() {
    this.getSingle();
  }

  updateSingle() {
    this.simpleSiteModel.id = this.id;
    this.simpleSitesService.updateSingleSimpleSite(this.simpleSiteModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/simplesites/']);
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

  getSingle() {
    this.simpleSitesService.getSingleSimpleSite(this.id).subscribe(operation => {
      if (operation && operation.success) {
        this.simpleSiteDto = operation.model;

        this.simpleSiteModel.userFirstName = this.simpleSiteDto.firstName;
        this.simpleSiteModel.userLastName = this.simpleSiteDto.lastName;
      } else {
        this.notifyService.error({text: operation.message || 'Error'});
      }
    });
  }

}
