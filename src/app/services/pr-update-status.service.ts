import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NotificationsService } from './notifications.service';
import { PrService } from './pr.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class PrUpdateStatusService {
  private statusColor:string;

  constructor(
    private sessionStorageService:SessionStorageService,
    private snackBar: MatSnackBar,
    private notif:NotificationsService,
    private pr:PrService,
    private websock:WebSocketService,
  ) { }

  updatePrRequest(prno, pr_status, stat, remarks) {
    const config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000,
      panelClass: ['statusSuccess']
    };

    let params = new FormData();
    let status:string;

    if (remarks == undefined || remarks == null || remarks == "") {
      remarks = "";
    }

    params.append('prno', prno);
    params.append('remarks', remarks);
    params.append('pr_status', stat);
    params.append('pr_request_status', pr_status);
    params.append('name', this.sessionStorageService.getSession('fullname'));

    this.pr.updatePrRequestAPI(params)
    .subscribe(data => {
      let result:any = data;

      if (result.status === "Success") {
        this.statusColor = 'statusSuccess';

        let title:string;
        let message:string;

        if (stat === "Disapprove") {
          title = `Purchase Request ${stat}`;
          message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;
          status = `${stat}(${pr_status})`;
          // if (this.data.pr_status === "Cancelled") {
          //   status = this.data.pr_status;
          // } else if(this.data.pr_status === "Disapprove") {
          //   status = `${this.data.pr_status}(${this.data.pr_request_status})`;
          // }
        } else if(stat === "Approve") {
            title = `Pending Purchase Request Approval`;
            message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;

            if (pr_status === "For DM Approval") {
              status = "For Budget Checking";
            }else if (pr_status === "For Budget Checking") {
              status = "For Cash Allocation";
            } else if (pr_status === "For Cash Allocation") {
              status = "For Printing";
            }
        } else if(stat === "Cancelled") {
          title = `Purchase Request ${stat}`;
          message = `Purchase Request: ${prno} has been ${stat} by ${this.sessionStorageService.getSession('username')}`;
          status = stat;
        }
        this.notif.insertNotification(title, message, this.sessionStorageService.getSession('access'), this.sessionStorageService.getSession('division'), status, prno).subscribe(data => {
          //this.websock.status_message = devicedeveui;
          console.log(data);
        });

        this.websock.sendNotif(message);
        this.websock.updateNotification();
        this.websock.updatePRTable();

      } else {
        this.statusColor = 'statusFailed';
      }
      config.panelClass = [this.statusColor];
      this.snackBar.open(`${stat} ${result.status}`, 'Close', config);
    });

  }
}
