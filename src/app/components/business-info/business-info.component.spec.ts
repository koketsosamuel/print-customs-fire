import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInfoComponent } from './business-info.component';

describe('BusinessInfoComponent', () => {
  let component: BusinessInfoComponent;
  let fixture: ComponentFixture<BusinessInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessInfoComponent]
    });
    fixture = TestBed.createComponent(BusinessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
