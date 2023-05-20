import { Component, OnInit } from '@angular/core';
import ICategory from 'src/app/models/category.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  categories: ICategory[] = [];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.loadingSpinnerService.show();
    this.categories = await this.categoryService.getCategories().finally(() => {
      this.loadingSpinnerService.hide();
    });
    this.categories = this.categories.filter(
      (category) => category?.images?.[0]?.link
    );
  }
}
