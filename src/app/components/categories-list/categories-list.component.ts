import { Component, Input } from '@angular/core';
import ICategory from 'src/app/models/category.interface';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  @Input() categories: ICategory[] = [];
}
