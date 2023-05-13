import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './pages/categories/add-category/add-category.component';
import { ViewCategoriesComponent } from './pages/categories/view-categories/view-categories.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { AddSubCategoryComponent } from './pages/sub-categories/add-sub-category/add-sub-category.component';
import { ViewSubCategoryComponent } from './pages/sub-categories/view-sub-category/view-sub-category.component';
import { PrintingPositionsFormComponent } from './pages/printing-positions/printing-positions-form/printing-positions-form.component';
import { PrintingPositionsComponent } from './pages/printing-positions/printing-positions/printing-positions.component';
import { PrintingMethodsFormComponent } from './pages/printing-methods/printing-methods-form/printing-methods-form.component';
import { PrintingMethodsViewComponent } from './pages/printing-methods/printing-methods-view/printing-methods-view.component';
import { HomePageComponent } from './pages/customer-facing/home-page/home-page.component';

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
  {
    path: 'product/add',
    component: AddProductComponent,
  },
  {
    path: 'product/edit/:productId',
    component: AddProductComponent,
  },
  {
    path: 'printing-positions/add',
    component: PrintingPositionsFormComponent,
  },
  {
    path: 'printing-positions/view',
    component: PrintingPositionsComponent,
  },
  {
    path: 'printing-positions/edit/:printingPositionId',
    component: PrintingPositionsFormComponent,
  },
  {
    path: 'printing-methods/add',
    component: PrintingMethodsFormComponent,
  },
  {
    path: 'printing-methods/edit/:printingMethodId',
    component: PrintingMethodsFormComponent,
  },
  {
    path: 'printing-methods/view',
    component: PrintingMethodsViewComponent,
  },
  {
    path: '',
    component: HomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
