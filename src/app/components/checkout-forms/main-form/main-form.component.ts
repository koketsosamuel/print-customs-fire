import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, first } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.scss',
})
export class MainFormComponent implements OnInit {
  mainForm: FormGroup;
  deliveryAddressForm: FormGroup;
  billingAddressForm: FormGroup;
  contactInfoAndPersonalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  sameAsBillingControl: FormControl = new FormControl(
    false,
    Validators.required
  );

  @Output() change: EventEmitter<any | null> = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alertService: AlertService
  ) {
    const southAfricanPhoneNumberPattern =
      /^(?:\+27|0)(?:\d{9}|\(\d{2}\)\s?\d{3}\s?\d{4})$/;

    this.deliveryAddressForm = formBuilder.group({
      streetAddress: ['', [Validators.required]],
      suburb: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      buildingName: [''],
      postalCode: ['', Validators.required],
      deliveryNotes: [''],
      sameAsBilling: this.sameAsBillingControl,
    });

    this.billingAddressForm = formBuilder.group({
      streetAddress: ['', Validators.required],
      suburb: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      buildingName: [''],
      postalCode: ['', Validators.required],
    });

    this.contactInfoAndPersonalInfoForm = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(southAfricanPhoneNumberPattern),
        ],
      ],
      alternativePhoneNumber: [
        '',
        Validators.pattern(southAfricanPhoneNumberPattern),
      ],
    });

    this.businessInfoForm = formBuilder.group({
      taxNumber: [''],
      name: [''],
    });

    this.mainForm = formBuilder.group({
      deliveryAddress: this.deliveryAddressForm,
      billingAddress: this.billingAddressForm,
      contactInfoAndPersonalInfo: this.contactInfoAndPersonalInfoForm,
      businessInformation: this.businessInfoForm,
    });
  }

  ngOnInit(): void {
    this.billingAddressForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((data) => {
        if (this.deliveryAddressForm.value.sameAsBilling) {
          this.mainForm.patchValue({ deliveryAddress: data });
        }
      });

    this.deliveryAddressForm.valueChanges.subscribe((data) => {
      const fields = [
        'streetAddress',
        'suburb',
        'city',
        'province',
        'buildingName',
        'postalCode',
      ];
      if (
        data.sameAsBilling &&
        !this.deliveryAddressForm.controls[fields[0]].disabled
      ) {
        fields.forEach((f) => this.deliveryAddressForm.controls[f].disable());
        this.deliveryAddressForm.patchValue(this.billingAddressForm.value);
      } else if (
        !data.sameAsBilling &&
        this.deliveryAddressForm.controls[fields[0]].disabled
      ) {
        fields.forEach((f) => this.deliveryAddressForm.controls[f].enable());
        this.deliveryAddressForm.patchValue({
          streetAddress: '',
          suburb: '',
          city: '',
          province: '',
          buildingName: '',
          postalCode: '',
        });
      }
    });

    this.mainForm.valueChanges.subscribe((values) => {
      this.change.emit(this.mainForm.valid ? values : null);
    });

    this.authService.userObservable.pipe(first()).subscribe((user) => {
      if (user && !user.isAnonymous) {
        this.profileService
          .getProfile()
          .then((data) => {
            if (data?.value) {
              this.mainForm.patchValue(data.value);
            }
          })
          .catch((err) => {
            this.alertService.error(
              'Error fetching your profile, please reload page!'
            );
          });
      }
    });
  }

  submit() {
    this.mainForm.markAllAsTouched();
    this.change.emit(this.mainForm.valid ? this.mainForm.value : null);
  }

  patch(data: Object) {
    this.mainForm.patchValue(data);
  }
}
