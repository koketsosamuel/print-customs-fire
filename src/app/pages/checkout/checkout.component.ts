import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';
import { LoginOrSignupComponent } from 'src/app/components/login-or-signup/login-or-signup.component';
import { ICartItem } from 'src/app/models/cart.interface';
import { User } from 'src/app/models/types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CustomizationPreviewDialogService } from 'src/app/services/customization-preview-dialog/customization-preview-dialog.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  deliveryAddressForm: FormGroup;
  billingAddressForm: FormGroup;
  contactInfoAndPersonalInfoForm: FormGroup;
  businessInfoForm: FormGroup;
  billingAddressSameAsDelivery = true;
  notRegisteredBusiness = false;
  initialLoad = false;
  items: ICartItem[] = [];
  total: string = '';
  vat: string = '';
  subTotal: string = '';
  deliveryFee: string = (250).toFixed(2);

  user: User | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly customizationPreviewServ: CustomizationPreviewDialogService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly auth: AuthService

  ) {

    this.deliveryAddressForm = formBuilder.group({
      streetAddress: ['', [Validators.required]],
      suburb: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      buildingName: [''],
      postalCode: ['', Validators.required],
      deliveryNotes: [''],
    })

    this.billingAddressForm = formBuilder.group({
      streetAddress: ['', Validators.required],
      suburb: [''],
      city: ['', Validators.required],
      province: ['', Validators.required],
      buildingName: [''],
      postalCode: ['', Validators.required],
    });

    const southAfricanPhoneNumberPattern = /^(?:\+27|0)(?:\d{9}|\(\d{2}\)\s?\d{3}\s?\d{4})$/;

    this.contactInfoAndPersonalInfoForm = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(southAfricanPhoneNumberPattern)]],
      alternativePhoneNumber: ['', Validators.pattern(southAfricanPhoneNumberPattern)],
    })

    this.businessInfoForm = formBuilder.group({
      taxNumber: ['', Validators.required],
      name: ['', Validators.required]
    }),

    this.checkoutForm = formBuilder.group({
      cartId: ['', Validators.required],
      userId: ['', Validators.required],
      deliveryAddress: this.deliveryAddressForm,
      billingAddress: this.billingAddressForm,
      businessInformation: this.businessInfoForm,
      contactInfoAndPersonalInfo: this.contactInfoAndPersonalInfoForm,
      createdAt: [new Date(), Validators.required],
      status: ['Pending Payment', Validators.required],
      subTotal: [0, Validators.required],
      deliveryFee: [this.deliveryFee, Validators.required],
      vat: [0, Validators.required],
      total: [0, Validators.required],
      numberOfItems: [0, Validators.required],
      paid: [false, Validators.required],
    })
  }

  ngOnInit() {
    this.initialLoad = true;
    this.auth.userObservable.subscribe(user => {
      this.user = user;
    })
    
    this.cartService
      .getUserCart()
      .then((cart) => {
        this.checkoutForm.patchValue({
          cartId: cart.id,
          userId: cart.userId
        });
        
        this.items = cart.cartItems as ICartItem[];
        this.checkoutForm.patchValue({ numberOfItems: this.items.length });
        this.setOrderSummary();
      })
      .finally(() => {
        this.initialLoad = false;
      });
      this.deliveryAddressForm.valueChanges.pipe(debounceTime(300)).subscribe(data => {
        if (this.billingAddressSameAsDelivery) {
          this.checkoutForm.patchValue({ billingAddress: data });
        }
      })
  }

  setOrderSummary() {

    let total, vat, subTotal = 0;

    let sum = 0;
    this.items.forEach((i) => (sum += i.totalPrice));
    total = sum;
    vat = Number(((total + subTotal) * 0.15).toFixed(2));
    subTotal = total - vat;
    total += Number(this.deliveryFee);

    this.total = total.toFixed(2);
    this.vat = vat.toFixed(2);
    this.subTotal = subTotal.toFixed(2);

    this.checkoutForm.patchValue({
      total: this.total,
      vat: this.vat,
      subTotal: this.subTotal,
      deliveryFee: this.deliveryFee
    })
  }

  checkout() {
    if (this.checkoutForm.valid) {
      this.loadingSpinner.show();

      this.orderService.createOrder(this.checkoutForm.value).then(res => {
        
        this.router.navigate(['/order-completed', res.id], { replaceUrl: true });
      }).catch(err => {
        this.alertService.error('Something went wrong, please try again.')
      }).finally(() => {
        this.loadingSpinner.hide();
      });
    } else {
      this.checkoutForm.markAllAsTouched();
      this.alertService.error('Please enter valid information on all fields')
    }
  }

  sameAddressAsDelivery(event: any) {
    if (event.checked) {
      this.checkoutForm.patchValue({
        billingAddress: {
          ...this.checkoutForm.value.deliveryAddress
        }
      })
    } else {
      this.billingAddressForm.reset();
    }
  }

  previewItem(item: any) {
    this.customizationPreviewServ.preview(item);
  }

  loginOrRegister() {
    this.dialog.open(LoginDialogComponent, {
      maxHeight: '90%',
      maxWidth: '90%',
      minWidth: '70%',
      minHeight: '50%',
    })
  }

  applyRequiredValidators(clear = false) {
    if (!clear) {
      this.checkoutForm.controls['businessInformation'].get('taxNumber')?.addValidators(Validators.required);
      this.checkoutForm.controls['businessInformation'].get('name')?.addValidators(Validators.required);
    } else {
      this.checkoutForm.controls['businessInformation'].get('taxNumber')?.clearValidators();
      this.checkoutForm.controls['businessInformation'].get('name')?.clearValidators();
    }
  }
}
