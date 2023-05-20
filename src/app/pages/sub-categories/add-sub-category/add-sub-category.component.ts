import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ISubCategory from 'src/app/models/sub-category.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { SubCategoryService } from 'src/app/services/sub-category/sub-category.service';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss'],
})
export class AddSubCategoryComponent implements OnInit {
  subCategory: ISubCategory = {
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
    category: '',
  };

  subCategoryId: string | null = null;

  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      this.subCategory.category = p.categoryId;
      this.subCategoryId = p.subCategoryId;

      if (p.subCategoryId) {
        this.loadingSpinner.show();
        this.subCategoryService
          .getSubCategoryById(p.subCategoryId)
          .then((subCategory: any) => {
            this.subCategory = subCategory.doc.data();
            this.loadingSpinner.hide();
          });
      }
    });
  }

  updateSubCategory() {
    this.loadingSpinner.show();
    this.subCategoryService
      .update(this.subCategoryId || '', this.subCategory)
      .then(() => {
        this.router.navigate([
          '/admin/sub-category/view',
          this.subCategory.category,
        ]);
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }
  saveSubCategory() {
    this.subCategoryService.addSubCategory(this.subCategory);
  }
}
