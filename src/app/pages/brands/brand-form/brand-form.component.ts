import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from 'src/app/models/brand.interface';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss'],
})
export class BrandFormComponent implements OnInit {
  brand: IBrand = {
    name: '',
    images: [],
  };
  edit = false;
  newImages: Blob[] = [];

  constructor(
    private readonly router: Router,
    private readonly brandsService: BrandsService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      if (params.brandId) {
        this.loadingSpinnerService.show();
        this.edit = true;
        const res: any = await this.brandsService
          .getBrandById(params.brandId)
          .finally(() => {
            this.loadingSpinnerService.hide();
          });
        this.brand = res.value;
      }
    });
  }

  submit() {
    !this.edit
      ? this.brandsService.addBrand(this.brand).then(() => {
          this.router.navigate(['/printing-positions/view']);
        })
      : this.brandsService
          .update(this.brand.id || '', this.brand, this.newImages)
          .then(() => {
            this.router.navigate(['/brands/view']);
          });
  }

  selectImage(event: any) {
    if (this.edit) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.newImages?.push(event.target.files[i]);
      }
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.brand.images.push(event.target.files[i]);
      }
    }
  }
}
