import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-completed',
  templateUrl: './order-completed.component.html',
  styleUrls: ['./order-completed.component.scss']
})
export class OrderCompletedComponent implements OnInit {

  orderId: string | null = null;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['orderId'];
  }
}
