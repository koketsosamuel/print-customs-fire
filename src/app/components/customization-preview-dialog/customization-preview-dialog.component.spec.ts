import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationPreviewDialogComponent } from './customization-preview-dialog.component';

describe('CustomizationPreviewDialogComponent', () => {
  let component: CustomizationPreviewDialogComponent;
  let fixture: ComponentFixture<CustomizationPreviewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizationPreviewDialogComponent]
    });
    fixture = TestBed.createComponent(CustomizationPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
