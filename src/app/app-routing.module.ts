import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './pages/categories/add-category/add-category.component';
import { ViewCategoriesComponent } from './pages/categories/view-categories/view-categories.component';
import { AddSubCategoryComponent } from './pages/sub-categories/add-sub-category/add-sub-category.component';
import { ViewSubCategoryComponent } from './pages/sub-categories/view-sub-category/view-sub-category.component';

const routes: Routes = [
  {
    path: 'category/add',
    component: AddCategoryComponent,
  },
  {
    path: 'category/view',
    component: ViewCategoriesComponent,
  },
  {
    path: 'category/edit/:categoryId',
    component: AddCategoryComponent,
  },
  {
    path: 'sub-category/add/:categoryId',
    component: AddSubCategoryComponent,
  },
  {
    path: 'sub-category/view/:categoryId',
    component: ViewSubCategoryComponent,
  },
  {
    path: 'sub-category/edit/:categoryId/:subCategoryId',
    component: AddSubCategoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
