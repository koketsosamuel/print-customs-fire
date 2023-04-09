import { Component, Input } from '@angular/core';
import { IImage } from 'src/app/models/product.interface';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss'],
})
export class ProductImageComponent {
  @Input() image: IImage = {
    path: '',
    link: '',
  };
  @Input() sort: boolean = false;
}
