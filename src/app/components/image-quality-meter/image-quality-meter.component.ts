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
      return {text: `Poor (${this.score}%)`, color: 'fg-red-600'}
    } else if (this.score >= 50 && this.score < 75) {
      return {text: `Medium (${this.score}%)`, color: 'fg-orange-600'}
    } else if (this.score >= 75 && this.score < 90) {
      return {text: `Satisfactory (${this.score}%)`, color: 'fg-orange-300'}
    } else if (this.score >= 90 && this.score < 100) {
      return {text: `High (${this.score}%)`, color: 'fg-green-600'}
    } else if (this.score >= 100) {
      return {text: `Extremely High (100%)`, color: 'fg-green-300'}
    }

    return {text: 'Pending calculation', color: 'fg-grey-800'}
  }
}
