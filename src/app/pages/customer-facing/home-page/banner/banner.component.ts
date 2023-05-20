import { Component, Input } from '@angular/core';
import ICategory from 'src/app/models/category.interface';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() categories: ICategory[] = [];
}
