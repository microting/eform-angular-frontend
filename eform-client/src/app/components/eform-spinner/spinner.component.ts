import { Component, OnInit } from '@angular/core';
import {LoaderService} from 'src/app/common/services/loeader.service';

@Component({
  selector: 'app-eform-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  loading: boolean;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
      // console.log(v);
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}
