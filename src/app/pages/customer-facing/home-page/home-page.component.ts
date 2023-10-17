import { Component, OnInit } from '@angular/core';
import ICategory from 'src/app/models/category.interface';
import IProduct from 'src/app/models/product.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  categories: ICategory[] = [];
  newestProducts: IProduct[] = [];
  bestSellingProducts: IProduct[] = [];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly productsService: ProductService
  ) {}

  async ngOnInit() {
    [this.categories, this.newestProducts, this.bestSellingProducts] = await Promise.all([this.categoryService.getCategories(), this.productsService.getProducts(
      'createdAt',
      false,
      [['active', '==', true]],
      6
    ), this.productsService.getProducts(
      'unitsSold',
      false,
      [['active', '==', true]],
      6
    )])
    

    this.categories = this.categories.filter(
      (category) => category?.images?.[0]?.link
    );
  }
}
