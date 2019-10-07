import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar-chart-pn',
  templateUrl: './bar-chart-pn.component.html',
  styleUrls: ['./bar-chart-pn.component.scss']
})
export class BarChartPnComponent implements OnInit {
  title: string;
  view: any[] = [1200, 700];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  legendPosition: string;
  timeline = true;
  showGridLines = true;
  colorScheme = {
    domain: ['#1E90FF', '#FF7800', '#a9a9a9', '#FF7F50', '#90EE90', '#FFB600']
  };
  constructor() { }

  ngOnInit() {
  }

  // data goes here
   single = [
    {
      'name': 'China',
      'value': 2243772
    },
    {
      'name': 'USA',
      'value': 1126000
    },
    {
      'name': 'Norway',
      'value': 296215
    },
    {
      'name': 'Japan',
      'value': 257363
    },
    {
      'name': 'Germany',
      'value': 196750
    },
    {
      'name': 'France',
      'value': 204617
    }
  ];
   multi = [
    {
      'name': 'China',
      'series': [
        {
          'name': '2018',
          'value': 2243772
        },
        {
          'name': '2017',
          'value': 1227770
        }
      ]
    },
    {
      'name': 'USA',
      'series': [
        {
          'name': '2018',
          'value': 1126000
        },
        {
          'name': '2017',
          'value': 764666
        }
      ]
    },
    {
      'name': 'Norway',
      'series': [
        {
          'name': '2018',
          'value': 296215
        },
        {
          'name': '2017',
          'value': 209122
        }
      ]
    },
    {
      'name': 'Japan',
      'series': [
        {
          'name': '2018',
          'value': 257363
        },
        {
          'name': '2017',
          'value': 205350
        }
      ]
    },
    {
      'name': 'Germany',
      'series': [
        {
          'name': '2018',
          'value': 196750
        },
        {
          'name': '2017',
          'value': 129246
        }
      ]
    },
    {
      'name': 'France',
      'series': [
        {
          'name': '2018',
          'value': 204617
        },
        {
          'name': '2017',
          'value': 149797
        }
      ]
    }
  ];
}

