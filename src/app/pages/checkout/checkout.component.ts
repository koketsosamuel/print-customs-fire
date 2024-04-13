import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ICartItem } from 'src/app/models/cart.interface';
import { CartService } from 'src/app/services/cart/cart.service';
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
  saveMyDetailsForNextPurchase = false;
  notRegisteredBusiness = false;
  loading = false;
  items: ICartItem[] = [];
  total: string = '';
  vat: string = '';
  subTotal: string = '';
  deliveryFee: string = (250).toFixed(2);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cartService: CartService,
    private readonly orderService: OrderService
  ) {

    this.deliveryAddressForm = formBuilder.group({
      streetAddress: ['', Validators.required],
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
      deliveryNotes: [''],
    });

    this.contactInfoAndPersonalInfoForm = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      alternativePhoneNumber: [''],
    })

    this.businessInfoForm = formBuilder.group({
      taxNumber: [''],
      name: ['']
    }),

    this.checkoutForm = formBuilder.group({
      id: ['', Validators.required],
      userId: ['', Validators.required],
      deliveryAddress: this.deliveryAddressForm,
      billingAddress: this.billingAddressForm,
      businessInformation: this.businessInfoForm,
      contactInfoAndPersonalInfo: this.contactInfoAndPersonalInfoForm,
      createdAt: [new Date(), Validators.required],
      status: ['Pending Payment', Validators.required],
      items: [[], Validators.required],
      subTotal: [0, Validators.required],
      delivery: [0, Validators.required],
      vat: [0, Validators.required],
      total: [0, Validators.required],
    })
  }

  ngOnInit() {
    this.loading =true;
    this.cartService
      .getUserCart()
      .then((cart) => {
        this.checkoutForm.patchValue({
          id: cart.id,
          userId: cart.userId
        });
        
        this.items = cart.cartItems as ICartItem[];
        this.checkoutForm.patchValue({items: this.items})
        
        this.setOrderSummary();
      })
      .finally(() => {
        this.loading = false;
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
    this.sameAddressAsDelivery({checked: this.sameAddressAsDelivery});
    this.orderService.createOrder(this.checkoutForm.value);
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

}
