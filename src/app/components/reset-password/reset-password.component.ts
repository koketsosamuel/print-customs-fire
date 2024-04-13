import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  @Output()
  backToLoginScreen: EventEmitter<void> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private readonly authService: AuthService) {
    this.resetForm = formBuilder.group({
      email: ['sam@coolsites.co.za', [Validators.required, Validators.email]],
    })
  }

  onRegister() {
    if (this.resetForm.valid) {
      const values = this.resetForm.value;
      this.authService.resetPassword(values.email);
    }
  }

  backToLogin() {
    this.backToLoginScreen.emit()
  }
}
