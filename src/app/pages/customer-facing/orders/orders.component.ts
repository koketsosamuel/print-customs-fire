import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = false;

  constructor(private readonly ordersService: OrderService, private readonly authService: AuthService) {}

  ngOnInit() {
    this.authService.userObservable.subscribe(async user => {
      if (user?.uid) {
        this.loading = true;
        this.orders = await this.ordersService.getOrdersByUserId(user.uid).then(res => {
          return res.map((o : any) => {
            return { ...o, createdAt: moment(o.createdAt.toDate()).format('DD MMMM YYYY')}
          });
        }).finally(() => {
          this.loading = false;
        });
      }
    })
  }
}
