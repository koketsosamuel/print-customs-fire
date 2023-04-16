import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationOptionFormComponent } from './variation-option-form.component';

describe('VariationOptionFormComponent', () => {
  let component: VariationOptionFormComponent;
  let fixture: ComponentFixture<VariationOptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariationOptionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariationOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
