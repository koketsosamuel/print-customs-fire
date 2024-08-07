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
import { BrandFormComponent } from './pages/brands/brand-form/brand-form.component';
import { SingleProductViewComponent } from './pages/customer-facing/single-product-view/single-product-view.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { BrandsViewComponent } from './pages/brands/brands-view/brands-view.component';
import { ProductsViewComponent } from './pages/products/products-view/products-view.component';
import { ProductCatalogueComponent } from './pages/customer-facing/catalog/product-catalogue/product-catalogue.component';
import { CustomizeProductComponent } from './pages/customer-facing/customize-product/customize-product.component';
import { ShoppingCartComponent } from './pages/customer-facing/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TrackOrderComponent } from './pages/customer-facing/track-order/track-order.component';
import { OrderCompletedComponent } from './pages/customer-facing/order-completed/order-completed.component';
import { Four04Component } from './pages/customer-facing/four04/four04.component';
import { LoginComponent } from './pages/customer-facing/login/login.component';
import { ProfileComponent } from './pages/customer-facing/profile/profile.component';
import { OrdersComponent } from './pages/customer-facing/orders/orders.component';

const routes: Routes = [
  {
    path: 'admin/category/add',
    component: AddCategoryComponent,
  },
  {
    path: 'admin/categories/view',
    component: ViewCategoriesComponent,
  },
  {
    path: 'admin/category/edit/:categoryId',
    component: AddCategoryComponent,
  },
  {
    path: 'admin/sub-category/add/:categoryId',
    component: AddSubCategoryComponent,
  },
  {
    path: 'admin/sub-category/view/:categoryId',
    component: ViewSubCategoryComponent,
  },
  {
    path: 'admin/sub-category/edit/:categoryId/:subCategoryId',
    component: AddSubCategoryComponent,
  },
  {
    path: 'admin/product/add',
    component: AddProductComponent,
  },
  {
    path: 'admin/product/edit/:productId',
    component: AddProductComponent,
  },
  {
    path: 'printing-positions/add',
    component: PrintingPositionsFormComponent,
  },
  {
    path: 'admin/printing-positions/view',
    component: PrintingPositionsComponent,
  },
  {
    path: 'admin/printing-positions/edit/:printingPositionId',
    component: PrintingPositionsFormComponent,
  },
  {
    path: 'admin/printing-methods/add',
    component: PrintingMethodsFormComponent,
  },
  {
    path: 'admin/printing-methods/edit/:printingMethodId',
    component: PrintingMethodsFormComponent,
  },
  {
    path: 'admin/printing-methods/view',
    component: PrintingMethodsViewComponent,
  },
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'admin/brands/add',
    component: BrandFormComponent,
  },
  {
    path: 'admin/brands/edit/:brandId',
    component: BrandFormComponent,
  },
  {
    path: 'products/:name/:productId',
    component: SingleProductViewComponent,
  },
  {
    path: 'admin-view',
    component: AdminPageComponent,
  },
  {
    path: 'admin/brands/view',
    component: BrandsViewComponent,
  },
  {
    path: 'admin/products/view',
    component: ProductsViewComponent,
  },
  {
    path: 'catalogue',
    component: ProductCatalogueComponent,
  },
  {
    path: 'customize/:productId',
    component: CustomizeProductComponent,
  },
  {
    path: 'customize/cart-item/:cartItemId',
    component: CustomizeProductComponent,
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent
  },
  {
    path: 'secure-checkout',
    component: CheckoutComponent
  },
  {
    path: 'track-order/:orderId',
    component: TrackOrderComponent
  },
  {
    path: 'order-completed/:orderId',
    component: OrderCompletedComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'my-orders',
    component: OrdersComponent
  },
  {
    path: '**',
    component: Four04Component
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
