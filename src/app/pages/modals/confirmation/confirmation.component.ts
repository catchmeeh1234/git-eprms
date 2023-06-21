import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrService } from '../../../services/pr.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../../services/session-storage.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public statusColor:string;
  public cancel_pr: FormGroup;

  public isVisible:boolean;

  private dataObject = {
    confirm: 'yes'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<ConfirmationComponent>,
    private pr: PrService,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService,
    private notif: NotificationsService,
    private websock: WebSocketService
  ) { }

  ngOnInit(): void {
    this.cancel_pr = new FormGroup({
      cancel_remarks: new FormControl(null, Validators.required),
    });

    this.isVisible = this.data.isRemarksVisible;
  }

  onConfirm(pr_num:string) {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['statusSuccess']
    };

    if (this.cancel_pr.valid === true || this.data.isRemarksVisible === false) {
      const { cancel_remarks } = this.cancel_pr.value;
      this.dataObject['remarks'] = cancel_remarks;

      this.dialogRef.close(this.dataObject);
    } else {
      this.statusColor = 'statusFailed';
      config.panelClass = [this.statusColor];
      this.snackBar.open('Something Went Wrong', 'Close', config);
    }
  }

  onCancel() {
    this.dataObject.confirm = "no";
    this.dialogRef.close(this.dataObject);
  }
}
