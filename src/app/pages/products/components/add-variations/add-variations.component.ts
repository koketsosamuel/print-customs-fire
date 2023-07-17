import { Component, Input } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { IVariation } from 'src/app/models/variation.interface';
import { ConfirmDialogueService } from 'src/app/services/confirm-dialogue/confirm-dialogue.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-add-variations',
  templateUrl: './add-variations.component.html',
  styleUrls: ['./add-variations.component.scss'],
})
export class AddVariationsComponent {
  @Input() product!: IProduct;

  constructor(
    private readonly confimDialogue: ConfirmDialogueService,
    private readonly productService: ProductService,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {}

  resetVariations() {
    this.confimDialogue.openDialogue(
      'Are you sure you want to clear variations? This action is irreversible',
      () => {
        this.product.variations = { name: '', options: [] };
      }
    );
  }

  saveChanges() {
    this.loadingSpinner.show();
    this.productService
      .update(this.product.id || '', {
        variations: this.product.variations,
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }
}
