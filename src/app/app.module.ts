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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCategoryComponent } from './categories/add-category/add-category.component';
import { ViewCategoriesComponent } from './categories/view-categories/view-categories.component';
import { ConfirmDialogueComponent } from './components/confirm-dialogue/confirm-dialogue.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    AddCategoryComponent,
    ViewCategoriesComponent,
    ConfirmDialogueComponent,
    LoadingSpinnerComponent,
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
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
