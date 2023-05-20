import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';

@Component({
  selector: 'app-printing-methods-form',
  templateUrl: './printing-methods-form.component.html',
  styleUrls: ['./printing-methods-form.component.scss'],
})
export class PrintingMethodsFormComponent implements OnInit {
  edit: boolean = false;
  printingMethodId = '';
  printingMethod: IPrintingMethod = {
    id: '',
    name: '',
    description: '',
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    shortName: '',
    thinLines: false,
    maxNumberOfColors: 0,
    minNumberOfColors: 0,
    minQuantity: 0,
    maxQuantity: 0,
    perColorCost: 0,
    setupFee: 0,
    perQuantityCost: 0,
  };
  newImages: Blob[] = [];

  constructor(
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      if (params.printingMethodId) {
        this.printingMethodId = params.printingMethodId;
        this.loadingSpinner.show();
        this.edit = true;
        const res = await this.printingMethodsService
          .getPrintingMethod(params.printingMethodId)
          .finally(() => {
            this.loadingSpinner.hide();
          });

        this.printingMethod = res.value;
      }
    });
  }

  submit() {
    !this.edit
      ? this.printingMethodsService.add(this.printingMethod).then(() => {
          this.router.navigate(['/admin/printing-methods/view']);
        })
      : this.printingMethodsService
          .update(
            this.printingMethod.id || '',
            this.printingMethod,
            this.newImages
          )
          .then(() => {
            this.router.navigate(['/admin/printing-methods/view']);
          });
  }

  selectImage(event: any) {
    this.newImages = [];
    if (this.edit) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.newImages?.push(event.target.files[i]);
      }
    } else {
      this.printingMethod.images = [];
      for (let i = 0; i < event.target.files.length; i++) {
        this.printingMethod.images?.push(event.target.files[i]);
      }
    }
  }
}
