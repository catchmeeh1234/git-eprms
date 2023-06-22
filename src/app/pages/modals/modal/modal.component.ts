import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  private dataObject = {
    confirm: 'no'
  };

  @Input() headerText: string;
  @Input() headerColor: string = '#ccc';
  @Input() headerWith: string;
  @Input() btnStyle: string;
  @Input() headerHeight: string;
  @Input() containerWidth: string;

  constructor(private dialogRef:MatDialogRef<ModalComponent>) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
