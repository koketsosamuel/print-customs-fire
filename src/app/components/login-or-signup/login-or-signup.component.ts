import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { matchFieldValueValidator } from 'src/app/validators/field-matches.validator';

@Component({
  selector: 'app-login-or-signup',
  templateUrl: './login-or-signup.component.html',
  styleUrls: ['./login-or-signup.component.scss'],
})
export class LoginOrSignupComponent {
  loginForm: FormGroup;
  isLogin = true;
  resetPassword = false;

  @Output()
  loginEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loadingSpinner.show()
      const values = this.loginForm.value;
      this.authService
        .signInWithEmailAndPassword(values.email, values.password)
        .then((res) => {
          this.emitUser(res.user);
        }).finally(() => {
          this.loadingSpinner.hide();
        });
    }
  }

  emitUser(user: any) {
    this.loginEvent.emit(user);
  }
}
