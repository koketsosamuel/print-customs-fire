import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'print-customs';
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0);
    });
  }
}
