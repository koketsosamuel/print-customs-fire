import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import IProduct from 'src/app/models/product.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SubCategoryService } from 'src/app/services/sub-category/sub-category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly subCategoryService: SubCategoryService,
    private readonly categoryService: CategoryService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      this.categories = await this.categoryService.getCategories(
        'name',
        true,
        [],
        null,
        null
      );

      if (params.productId) {
        try {
          this.loadingSpinner.show();
          this.productId = params.productId;
          this.edit = true;
          await this.getProduct();

          if (this.product.categories.length > 0) {
            await this.getSubCategories();
          }
        } catch (err) {
        } finally {
          this.loadingSpinner.hide();
        }
      }
    });
  }

  selectedStepIndex = 0;
  edit: boolean = false;
  product: IProduct = {
    name: '',
    description: '',
    price: 0,
    promotion: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [],
    subCategories: [],
    images: [],
    keywords: [],
    variations: {
      name: '',
      options: [],
    },
    printingPositions: [],
  };
  productId: string | null = null;
  categories: ICategory[] = [];
  subCategoryGroups: any[] = [];

  addProduct(product: IProduct) {
    this.productService.addProduct(product).then((product) => {
      this.product = product;
      this.selectedStepIndex += 1;
      this.edit = true;
      this.productId = product?.id;
    });
  }

  updateProduct(product: IProduct) {
    const updateObj = { ...product };
    delete updateObj.images;
    this.productService.update(updateObj?.id || '', updateObj);
  }

  getProduct() {
    this.loadingSpinner.show();
    return this.productService
      .getProduct(this.productId || '')
      .then((data: any) => {
        this.product = data.value;
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  async getSubCategories(event: any = null) {
    return await this.subCategoryService
      .getSubCategoryGroups(this.product.categories)
      .then((groups: any[]) => {
        groups = groups.map((gp: any) => {
          gp.category = this.categories.filter((c) => c.id === gp.category)[0];
          return gp;
        });
        this.subCategoryGroups = groups;
      });
  }

  submitProduct(product: IProduct) {
    return this.edit ? this.updateProduct(product) : this.addProduct(product);
  }
}
