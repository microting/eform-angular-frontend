import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dashboard-interviews-edit',
  templateUrl: './dashboard-interviews-edit.component.html',
  styleUrls: ['./dashboard-interviews-edit.component.scss']
})
export class DashboardInterviewsEditComponent implements OnInit {
  tableData = interviewsData;

  constructor() {
  }

  ngOnInit() {
  }

}

const interviewsData = [
  {
    date: new Date(),
    locationName: 'LocationName 1',
    commentary: 'Lorem ipsum'
  },
  {
    date: new Date(),
    locationName: 'LocationName 2',
    commentary: 'is simply dummy text of the printing and typesetting industry. ' +
      'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s'
  },
  {
    date: new Date(),
    locationName: 'LocationName N',
    commentary: 'It is a long established fact that a reader will be distracted by ' +
      'the readable content of a page when looking at its layout. The point of ' +
      'using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\''
  }
];
