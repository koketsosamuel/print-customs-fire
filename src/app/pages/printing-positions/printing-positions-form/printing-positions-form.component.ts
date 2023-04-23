import { A } from '@angular/cdk/keycodes';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';

@Component({
  selector: 'app-printing-positions-form',
  templateUrl: './printing-positions-form.component.html',
  styleUrls: ['./printing-positions-form.component.scss'],
})
export class PrintingPositionsFormComponent implements OnInit {
  edit: boolean = false;
  printingPosition: IPrintingPosition = {
    name: '',
    description: '',
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    shortName: '',
  };
  newImages: Blob[] = [];

  constructor(
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      if (params.printingPositionId) {
        this.loadingSpinner.show();
        this.edit = true;
        const res = await this.printingPositionsService
          .getPrintingPosition(params.printingPositionId)
          .finally(() => {
            this.loadingSpinner.hide();
          });

        this.printingPosition = res.value;
        console.log(params, this.printingPosition);
      }
    });
  }

  submit() {
    !this.edit
      ? this.printingPositionsService.add(this.printingPosition).then(() => {
          this.router.navigate(['/printing-positions/view']);
        })
      : this.printingPositionsService
          .update(
            this.printingPosition.id || '',
            this.printingPosition,
            this.newImages
          )
          .then(() => {
            this.router.navigate(['/printing-positions/view']);
          });
  }

  selectImage(event: any) {
    if (this.edit) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.newImages?.push(event.target.files[i]);
      }
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.printingPosition.images?.push(event.target.files[i]);
      }
    }
  }
}
