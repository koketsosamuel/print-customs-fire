import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuillModule } from 'ngx-quill';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCategoryComponent } from './pages/categories/add-category/add-category.component';
import { ViewCategoriesComponent } from './pages/categories/view-categories/view-categories.component';
import { ConfirmDialogueComponent } from './components/confirm-dialogue/confirm-dialogue.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AddSubCategoryComponent } from './pages/sub-categories/add-sub-category/add-sub-category.component';
import { ViewSubCategoryComponent } from './pages/sub-categories/view-sub-category/view-sub-category.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { ProductFormComponent } from './pages/products/components/product-form/product-form.component';
import { ManageImagesComponent } from './pages/products/components/manage-images/manage-images.component';
import { ProductImageComponent } from './pages/products/components/product-image/product-image.component';
import { AddVariationsComponent } from './pages/products/components/add-variations/add-variations.component';
import { VariationFormComponent } from './pages/products/components/add-variations/variation-form/variation-form.component';
import { VariationOptionFormComponent } from './pages/products/components/add-variations/variation-option-form/variation-option-form.component';
import { PrintingPositionsFormComponent } from './pages/printing-positions/printing-positions-form/printing-positions-form.component';
import { PrintingPositionsComponent } from './pages/printing-positions/printing-positions/printing-positions.component';
import { PrintingMethodsFormComponent } from './pages/printing-methods/printing-methods-form/printing-methods-form.component';
import { PrintingMethodsViewComponent } from './pages/printing-methods/printing-methods-view/printing-methods-view.component';
import { PrintingPostionsSelectComponent } from './pages/printing-positions/printing-postions-select/printing-postions-select.component';
import { ImageCardOptionComponent } from './components/image-card-option/image-card-option.component';
import { ImageCardOptionsSelectionComponent } from './components/image-card-options-selection/image-card-options-selection.component';
import { ImageCanvasPositionComponent } from './components/image-canvas-position/image-canvas-position.component';
import { AddPrintingPositionsComponent } from './pages/products/components/add-printing-positions/add-printing-positions.component';
import { PrintingMethodsSelectComponent } from './pages/printing-methods/printing-methods-select/printing-methods-select.component';
import { HomePageComponent } from './pages/customer-facing/home-page/home-page.component';
import { BannerComponent } from './pages/customer-facing/home-page/banner/banner.component';
import { BrandFormComponent } from './pages/brands/brand-form/brand-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AddCategoryComponent,
    ViewCategoriesComponent,
    ConfirmDialogueComponent,
    LoadingSpinnerComponent,
    AddSubCategoryComponent,
    ViewSubCategoryComponent,
    AddProductComponent,
    ProductFormComponent,
    ManageImagesComponent,
    ProductImageComponent,
    AddVariationsComponent,
    VariationFormComponent,
    VariationOptionFormComponent,
    PrintingPositionsFormComponent,
    PrintingPositionsComponent,
    PrintingMethodsFormComponent,
    PrintingMethodsViewComponent,
    PrintingPostionsSelectComponent,
    ImageCardOptionComponent,
    ImageCardOptionsSelectionComponent,
    ImageCanvasPositionComponent,
    AddPrintingPositionsComponent,
    PrintingMethodsSelectComponent,
    HomePageComponent,
    BannerComponent,
    BrandFormComponent,
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyB-UOtsB4KhdLRQ6vOE8NSmUIsYeLCGGik',
      authDomain: 'custom-prints-aae9c.firebaseapp.com',
      projectId: 'custom-prints-aae9c',
      storageBucket: 'custom-prints-aae9c.appspot.com',
      messagingSenderId: '231109156445',
      appId: '1:231109156445:web:b3ef926a2f428b94f477b4',
      measurementId: 'G-5DEE87M51W',
    }),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatStepperModule,
    DragDropModule,
    BrowserAnimationsModule,
    FormsModule,
    QuillModule.forRoot(),
    MatProgressBarModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
