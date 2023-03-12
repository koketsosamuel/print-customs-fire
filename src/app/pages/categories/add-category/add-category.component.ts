import { Component, OnInit } from '@angular/core';
import ICategory from 'src/app/models/category.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  category: ICategory = {
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
  };

  categoryId: string | null = null;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.categoryId) {
        this.loadingSpinner.show();
        this.categoryId = p.categoryId;
        this.categoryService
          .getCategoryById(p.categoryId)
          .subscribe((category: any) => {
            this.category = category.data();
            this.loadingSpinner.hide();
          });
      }
    });
  }

  saveCategory() {
    this.categoryService.addCategory(this.category).then(() => {
      this.router.navigate(['/category/view']);
    });
  }

  async updateCategory() {
    this.categoryService
      .update(this.categoryId || '', this.category)
      .then(() => {
        this.router.navigate(['/category/view']);
      });
  }
}
