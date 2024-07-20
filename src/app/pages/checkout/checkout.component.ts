import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { MainFormComponent } from 'src/app/components/checkout-forms/main-form/main-form.component';
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

  @ViewChild('checkoutMainForm') checkoutDetailsForm!: MainFormComponent;

  checkoutForm: FormGroup;
  billingAddressSameAsDelivery = true;
  notRegisteredBusiness = false;
  initialLoad = false;
  items: ICartItem[] = [];
  total: string = '';
  vat: string = '';
  subTotal: string = '';
  deliveryFee: string = (250).toFixed(2);
  checkoutProfileInformation: Object | null = null;

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
    this.checkoutForm = formBuilder.group({
      cartId: ['', Validators.required],
      userId: ['', Validators.required],
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
      console.log(user);
      
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

  setCheckoutProfileInfo(data: any | null) {
    this.checkoutProfileInformation = data;
  }

  checkout() {
    this.checkoutDetailsForm.submit();
    if (this.checkoutForm.valid && this.checkoutProfileInformation) {
      this.loadingSpinner.show();
      this.orderService.createOrder({ ...this.checkoutForm.value, ...this.checkoutProfileInformation }).then(res => {
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

}
