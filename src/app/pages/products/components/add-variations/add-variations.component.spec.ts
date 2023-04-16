import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVariationsComponent } from './add-variations.component';

describe('AddVariationsComponent', () => {
  let component: AddVariationsComponent;
  let fixture: ComponentFixture<AddVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVariationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
