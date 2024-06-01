import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICartItem } from 'src/app/models/cart.interface';
import { CustomizationPreviewDialogService } from 'src/app/services/customization-preview-dialog/customization-preview-dialog.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {
  order: any;

  constructor(
    private readonly orderService: OrderService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly customizationPreviewServ: CustomizationPreviewDialogService,
    public readonly utilServ: UtilService
  ) {}

  async ngOnInit() {
    const orderId = this.activatedRoute.snapshot.params['orderId'];
    this.order = await this.orderService.getOrder(orderId).then(res => res.value);
    this.order = await this.orderService.getOrderByOrderNumber('MM35378MFG').then(res => res.value);
  }

  formatAddress(billingAddress: any) {
    const { streetAddress, suburb, city, province, buildingName, postalCode } = billingAddress;

    let formattedAddress = `${streetAddress}`;
    if (buildingName) {
        formattedAddress += `, ${buildingName}`;
    }
    if (suburb) {
        formattedAddress += `, ${suburb}`;
    }
    formattedAddress += `, ${city}, ${province}, ${postalCode}`;

    return formattedAddress;
  }

  previewItem(item: any) {
    this.customizationPreviewServ.preview(item);
  }
}
