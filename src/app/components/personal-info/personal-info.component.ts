import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  @Input({required: true})
  contacDetailsAndPersonalDetails!: FormGroup;
  user: firebase.default.User | null = null;

  constructor(private readonly authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.userObservable.subscribe(user => {
      this.user = user;
    })
  }
}
