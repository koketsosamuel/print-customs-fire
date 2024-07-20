import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainFormComponent } from 'src/app/components/checkout-forms/main-form/main-form.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: MainFormComponent;

  resetPasswordForm: FormGroup;
  changeEmailForm: FormGroup;
  profileData: Object | null = null;
  user: firebase.default.User | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profileService: ProfileService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService
  ) {
    this.resetPasswordForm = formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });

    this.changeEmailForm = formBuilder.group({
      currentPassword: ['', Validators.required],
      newEmail: ['', [Validators.required, Validators.email]],
      confirmNewEmail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.userObservable.subscribe((user) => (this.user = user));
  }

  updateProfile() {
    this.loadingSpinner.show();
    this.profileService
      .updateProfile(this.profileData as Object)
      .then((data) => {
        this.alertService.success('Profile updated!');
      })
      .catch((err) => {
        this.alertService.error('Error updating profile, please retry!');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  setProfileData(data: Object | null) {
    this.profileData = data;
  }

  changePassword() {
    this.loadingSpinner.show();
    const changePasswordFormValues = this.resetPasswordForm.value;
    this.authService.changePassword(
      changePasswordFormValues.currentPassword,
      changePasswordFormValues.newPassword
    ).then(() => {
      this.alertService.success('Password has been changed succesfully');
      this.resetPasswordForm.reset();
    }).catch(err => {
      this.alertService.error('Error changing password, please retry')
    }).finally(() => {
      this.loadingSpinner.hide();
    })
  }

  changeEmail() {
    this.loadingSpinner.show();
    const changeEmailFormValues = this.changeEmailForm.value;
    this.authService.changeLoginEmail(
      changeEmailFormValues.currentPassword,
      changeEmailFormValues.newEmail
    ).then(() => {
      this.alertService.success('Login email has been changed succesfully');
      this.changeEmailForm.reset();
      this.changeEmailForm.markAsUntouched();
      this.changeEmailForm.markAsPristine();
      Object.keys(this.changeEmailForm.controls).forEach(key => {
        this.changeEmailForm?.get(key)?.reset();
        this.changeEmailForm?.get(key)?.markAsUntouched();
        this.changeEmailForm?.get(key)?.markAsPristine();
      });
    }).catch(err => {
      this.alertService.error(err?.message)
    }).finally(() => {
      this.loadingSpinner.hide();
    })
  }
}
