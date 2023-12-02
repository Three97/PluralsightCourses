import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'pm-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnChanges {
  overallWidth: number = 75;
  maxStars: number = 5;
  cropWidth: number = this.overallWidth;
  @Input() rating: number = 0;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(): void {
    this.cropWidth = this.rating * (this.overallWidth / this.maxStars);
  }

  onClick() {
    this.ratingClicked.emit(`The rating ${this.rating} was clicked.`);
  }
}
