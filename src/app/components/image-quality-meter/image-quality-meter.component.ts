import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-quality-meter',
  templateUrl: './image-quality-meter.component.html',
  styleUrls: ['./image-quality-meter.component.scss']
})
export class ImageQualityMeterComponent {
  @Input({required: true}) score: number = 0;

  getScoreRating() {
    if (this.score > 0 && this.score < 50) {
      return {text: `Poor`, color: 'bg-red-600', hint: 'the print will be low quality and pixelated'}
    } else if (this.score >= 50 && this.score < 75) {
      return {text: `Medium`, color: 'bg-orange-600', hint: 'the print may be low quality and might be pixelated'}
    } else if (this.score >= 75 && this.score < 90) {
      return {text: `Satisfactory`, color: 'bg-orange-400'}
    } else if (this.score >= 90 && this.score < 100) {
      return {text: `High`, color: 'bg-green-600'}
    } else if (this.score >= 100) {
      return {text: `Extremely High (100%)`, color: 'bg-green-300'}
    }

    return {text: 'Pending', color: 'bg-grey-800'}
  }
}
