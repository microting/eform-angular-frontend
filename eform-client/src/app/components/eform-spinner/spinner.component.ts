import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoaderService} from 'src/app/common/services';

@Component({
    selector: 'app-eform-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: false
})
export class SpinnerComponent implements OnInit {
  loading: boolean;
  display: string = 'none';

  constructor(
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    // Subscribes to the "isLoading" observable to get notified of changes in the loading state
    this.loaderService.isLoading.subscribe(isLoading => {
      // Updates the "loading" property using the current state of the "isLoading" observable
      this.loading = isLoading;
      this.display = isLoading ? 'display: block;' : 'display: none;';
      // Triggers change detection to update the view with the new loading state
      // fix error after loading state change after angular detect changes (https://angular.io/errors/NG0100)
      this.cdr.detectChanges();
    });
  }
}
