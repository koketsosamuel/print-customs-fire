import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-text',
  templateUrl: './info-text.component.html',
  styleUrl: './info-text.component.scss'
})
export class InfoTextComponent {
  @Input() type: 'info' | 'error' | 'warning' = 'info';
  @Input() text: string = '';
}
