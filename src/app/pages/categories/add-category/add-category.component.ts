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
    images: [],
  };
  edit = false;
  categoryId: string | null = null;
  newImages: Blob[] = [];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.categoryId) {
        this.edit = true;
        this.loadingSpinner.show();
        this.categoryId = p.categoryId;
        this.categoryService
          .getCategoryById(p.categoryId)
          .then((category: any) => {
            this.category = category.doc.data();
            this.loadingSpinner.hide();
          });
      }
    });
  }

  saveCategory() {
    this.categoryService.addCategory(this.category).then(() => {
      this.router.navigate(['/admin/category/view']);
    });
  }

  async updateCategory() {
    this.categoryService
      .update(this.categoryId || '', this.category, this.newImages)
      .then(() => {
        this.router.navigate(['/admin/category/view']);
      });
  }

  selectImage(event: any) {
    if (this.edit) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.newImages?.push(event.target.files[i]);
      }
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.category.images?.push(event.target.files[i]);
      }
    }
  }
}
