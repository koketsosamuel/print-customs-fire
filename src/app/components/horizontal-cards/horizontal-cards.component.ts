import { Component, Input } from '@angular/core';
import IProduct from 'src/app/models/product.interface';

@Component({
  selector: 'app-horizontal-cards',
  templateUrl: './horizontal-cards.component.html',
  styleUrls: ['./horizontal-cards.component.scss'],
})
export class HorizontalCardsComponent {
  @Input() products: IProduct[] = [];
  @Input() heading: string = '';
}
