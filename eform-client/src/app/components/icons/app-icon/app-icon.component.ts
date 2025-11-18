import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [MatIconModule, NgStyle],
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss']
})
export class AppIconComponent {
  @Input() name!: string;
  @Input() size: number | string = 20;
  @Input() color: string = 'currentColor';
}
