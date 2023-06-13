import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomizationPositionsComponent } from './select-customization-positions.component';

describe('SelectCustomizationPositionsComponent', () => {
  let component: SelectCustomizationPositionsComponent;
  let fixture: ComponentFixture<SelectCustomizationPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCustomizationPositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCustomizationPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
