import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrService } from '../../../services/pr.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../../services/session-storage.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WebSocketService } from '../../../services/web-socket.service';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-confirmation-generic',
  templateUrl: './confirmation-generic.component.html',
  styleUrls: ['./confirmation-generic.component.scss']
})
export class ConfirmationGenericComponent implements OnInit {

  public statusColor:string;
  public cancel_pr: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<ConfirmationGenericComponent>,
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
  }

  onConfirm(pr_num) {
    this.dialogRef.close('yes');
  }

  onCancel() {
    this.dialogRef.close('no');
  }

}
