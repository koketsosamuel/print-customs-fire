import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';

@Component({
  selector: 'app-select-customization-positions',
  templateUrl: './select-customization-positions.component.html',
  styleUrls: ['./select-customization-positions.component.scss'],
})
export class SelectCustomizationPositionsComponent implements OnInit {
  @Input() availableLocations: string[] = [];
  options: IImageCardOption[] = [];
  @Input() selectedOptions: string[] = [];
  @Output() change = new EventEmitter<any[]>();

  constructor(
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.loadingSpinnerService.show();
    const promises = Promise.all(
      this.availableLocations.map(async (printingLocationId) => {
        const printingLocation = (
          await this.printingPositionsService.getPrintingPosition(
            printingLocationId
          )
        ).value;

        return {
          name: printingLocation.name,
          value: 'printingLocation',
          object: { ...printingLocation, printingLocation },
          imgSrc: printingLocation.images[0].link,
          selected: !!this.selectedOptions.includes(printingLocation.id),
        };
      })
    );

    promises
      .then((res) => {
        this.options = res;
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  updatedSelectedPrintingLocations(selected: any) {
    this.selectedOptions = selected;
  }

  goToNextPage() {
    this.change.emit(this.selectedOptions);
  }
}
