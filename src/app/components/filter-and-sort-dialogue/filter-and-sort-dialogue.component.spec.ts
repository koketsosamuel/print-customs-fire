import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAndSortDialogueComponent } from './filter-and-sort-dialogue.component';

describe('FilterAndSortDialogueComponent', () => {
  let component: FilterAndSortDialogueComponent;
  let fixture: ComponentFixture<FilterAndSortDialogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterAndSortDialogueComponent]
    });
    fixture = TestBed.createComponent(FilterAndSortDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
