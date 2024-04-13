import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { matchFieldValueValidator } from 'src/app/validators/field-matches.validator';

@Component({
  selector: 'app-register-new-user',
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.scss']
})
export class RegisterNewUserComponent {

  registerForm: FormGroup;

  @Output()
  loginEvent: EventEmitter<any> = new EventEmitter();

  @Output()
  alreadyHaveAccountEvent: EventEmitter<void> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private readonly authService: AuthService) {
    this.registerForm = formBuilder.group({
      email: ['sam@coolsites.co.za', [Validators.required, Validators.email]],
      password: ['23656dgy4', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', matchFieldValueValidator('password')]
    })
  }

  onRegister() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      this.authService.registerUserWithEmailAndPassword(values.email, values.password).then(res => {
        this.loginEvent.emit(res.user);
      });
    }
  }

  alreadyHaveAccount() {
    this.alreadyHaveAccountEvent.emit()
  }

}
