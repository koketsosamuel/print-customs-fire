import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingPostionsSelectComponent } from './printing-postions-select.component';

describe('PrintingPostionsSelectComponent', () => {
  let component: PrintingPostionsSelectComponent;
  let fixture: ComponentFixture<PrintingPostionsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingPostionsSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingPostionsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
