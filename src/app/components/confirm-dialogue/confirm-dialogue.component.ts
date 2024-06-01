import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialogue',
  templateUrl: './confirm-dialogue.component.html',
  styleUrls: ['./confirm-dialogue.component.scss'],
})
export class ConfirmDialogueComponent implements OnInit {
  code = 'ABCD';
  confirmCode = '';
  softConfirm = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
    this.code = String(Math.ceil(Math.random() * 8999) + 1000);
    this.softConfirm = !!this.data.softConfirm;
  }
}
