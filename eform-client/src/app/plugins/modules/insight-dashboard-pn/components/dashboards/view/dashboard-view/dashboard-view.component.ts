import {Component, OnDestroy, OnInit} from '@angular/core';
import {InsightDashboardPnDashboardsService} from '../../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {DashboardViewModel} from '../../../../models';
import {DashboardChartTypesEnum, DashboardItemQuestionTypesEnum} from '../../../../const/enums';
import * as domtoimage from 'dom-to-image';
import {DashboardViewExportDocModel} from '../../../../models/dashboard/dashboard-view/dashboard-view-export-doc.model';
import {saveAs} from 'file-saver';

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss']
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  selectedDashboardId: number;
  getDashboardSub$: Subscription;
  exportToDocSub$: Subscription;
  dashboardViewModel: DashboardViewModel = new DashboardViewModel();

  constructor(private dashboardsService: InsightDashboardPnDashboardsService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedDashboardId = params['dashboardId'];
      this.getDashboardForView(this.selectedDashboardId);
    });
  }

  getDashboardForView(dashboardId: number) {
    this.getDashboardSub$ = this.dashboardsService.getSingleForView(dashboardId)
      .subscribe((data) => {
        if (data && data.success) {
          this.dashboardViewModel = data.model;
        }
      });
  }

  exportToDoc() {
    const context = this;
    const scale = 2;
    const exportDocModel = new DashboardViewExportDocModel();
    exportDocModel.dashboardId = this.dashboardViewModel.id;

    Promise.all(this.getParsedItemsPromise()).then(data => {
      this.exportItemsToDoc({...exportDocModel, files: data});
    });
  }

  getParsedItemsPromise() {
    const scale = 2;
    const domArray = this.dashboardViewModel.items.filter(x => x.firstQuestionType !== DashboardItemQuestionTypesEnum.Text).map(item => {
      return {name: `copyableChart${item.position}`, chartType: item.chartType, itemId: item.id};
    });
    const imageArray = [];
    const promiseArray = [];
    domArray.map((target) => {
      const node = document.getElementById(target.name);
      promiseArray.push(domtoimage.toBlob(node, {
        // add greater scaling
        height: node.offsetHeight * scale,
        width: target.chartType === DashboardChartTypesEnum.HorizontalBarStackedGrouped
          ? node.scrollWidth * scale : node.offsetWidth * scale,
        style: {
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left',
          width: node.offsetWidth + 'px',
          height: node.offsetHeight + 'px'
        }
      })
        .then(function (data) {
          try {
            return new File([data], `${target.itemId}`);
          } catch (e) {
            console.error(e, e.message);
            return {};
          }
        })
        .catch(function (error) {
          console.error('Chart could not be copied', error);
          return {};
        }));
    });

    return promiseArray;
  }

  ngOnDestroy(): void {
  }

  private exportItemsToDoc(model: DashboardViewExportDocModel) {
    this.exportToDocSub$ = this.dashboardsService.exportToDoc(model)
      .subscribe((data) => {
        if (data) {
          const blob = new Blob([data]);
          saveAs(blob, `doc.docx`);
        }
      });
  }
}
