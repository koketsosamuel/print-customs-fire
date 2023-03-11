import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { ViewCategoriesComponent } from './categories/view-categories/view-categories.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
