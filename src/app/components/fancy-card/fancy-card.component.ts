import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fancy-card',
  templateUrl: './fancy-card.component.html',
  styleUrls: ['./fancy-card.component.scss'],
})
export class FancyCardComponent {
  @Input() small = false;
}
