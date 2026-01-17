import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {LoaderService} from 'src/app/common/services';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-eform-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    imports: [MatProgressSpinner]
})
export class SpinnerComponent implements OnInit {
  loaderService = inject(LoaderService);
  private cdr = inject(ChangeDetectorRef);

  loading: boolean;
  display: string = 'none';

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
