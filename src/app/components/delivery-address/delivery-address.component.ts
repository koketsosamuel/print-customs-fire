import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent {
  @Input({required: true}) addressForm!: FormGroup;
  @Input() deliveryAddress = false;

  provinces: string[] = [
    "Gauteng",
    "Western Cape",
    "KwaZulu-Natal",
    "Eastern Cape",
    "Mpumalanga",
    "Limpopo",
    "North West",
    "Free State",
    "Northern Cape"
  ]
  
}
