import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginOrSignupComponent } from './login-or-signup.component';

describe('LoginOrSignupComponent', () => {
  let component: LoginOrSignupComponent;
  let fixture: ComponentFixture<LoginOrSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginOrSignupComponent]
    });
    fixture = TestBed.createComponent(LoginOrSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
