import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'cdk-toolbar-notification',
  templateUrl: './toolbar-notification.component.html',
  styleUrls: ['./toolbar-notification.component.scss']
})
export class ToolbarNotificationComponent implements OnInit {
	cssPrefix = 'toolbar-notification';
  isOpen: boolean = false;
  @Input() notifications = [];

  private division = this.sessionStorageService.getSession('division');
  private role = this.sessionStorageService.getSession('access');

    /*@HostListener('document:click', ['$event', '$event.target'])
      onClick(event: MouseEvent, targetElement: HTMLElement) {
        if (!targetElement) {
          return;
        }
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
          this.isOpen = false;
        }
      }*/

  	constructor(
      private elementRef: ElementRef,
      public notif: NotificationsService,
      private sessionStorageService: SessionStorageService,
      private router:Router
    ) { }

  	ngOnInit() {
      this.notif.viewNotifications(this.division, this.role)
      .subscribe(data => {
        let result:any = data;
        this.notif.notificationContent = result;
      });
  	}

  	select(selectedPrNO) {
      const queryParams = { prnum: selectedPrNO };
      const navigationExtras: NavigationExtras = {
        queryParams,
        queryParamsHandling: 'merge' // 'merge' will merge the new parameters with the existing ones
      };
      this.router.navigate(['/auth/pages/viewPR']);

      setTimeout(() => {
          this.router.navigate(['/auth/pages/viewItems'], navigationExtras);
      }, 0);

  	}

  	delete(notification) {

  	}

}
