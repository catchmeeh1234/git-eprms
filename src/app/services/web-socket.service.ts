import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { NotificationsService } from './notifications.service';
import { PrService } from './pr.service';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socket: any;
  public status_message: string;
  public weatherInfo:any = {
    City: null,
    Country: null,
    Temperature: null
  };

  public response:any;

  constructor(
    private sessionStorageService:SessionStorageService,
    private pr: PrService,
    private notif: NotificationsService
  ) {
    this.status_message = "";

  }
  openSocket() {
    this.socket = io('https://backend.eprms.home:4301', {
      //transports: ['websocket'],
      rejectUnauthorized: false
    });
  }

  logUserToServer() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      let username = this.sessionStorageService.getSession('username');

      // send data to server on connection
      this.socket.emit('userData', { message: username });
    });
  }

  disconnectSocket() {
    this.socket.on('disconnect', () => {
      let now = new Date();

      console.log(`Socket.IO connection closed. Time: ${now}`);
    });
  }

  closeSocket() {
    if (this.socket !== undefined && this.socket !== null) {
      this.socket.disconnect();
    }
  }

  showDesktopNotification() {
    this.closeSocket();
    this.openSocket();
    this.logUserToServer();

    this.socket.on('message', () => {
      let now = new Date();

      console.log(`Socket.IO connection established Time: ${now}`);
    });

    this.socket.on('updateApprovePR', (data: any) => {
      let access = this.sessionStorageService.getSession('access');
      let div = this.sessionStorageService.getSession('division');

      this.pr.approvePr(div, access)
      .subscribe(res => {
        let result:any = res;
        if (this.pr.dataSource !== undefined && this.pr.dataSource !== null) {
          this.pr.dataSource.data = result;
        }
      });
    });

    this.socket.on('message', (data: any) => {
      const pathToIcon = './assets/bell.png';
      if (Notification.permission === 'granted') {
        this.notif.createDesktopNotification(data, pathToIcon);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            this.notif.createDesktopNotification(data, pathToIcon);
          }
        });
      }

      this.pr.loadPRNo()
      .subscribe(data => {
        this.response = data;
      });

    });

    this.socket.on('notifications', (data: any) => {
      // console.log(data);
      // console.log(this.sessionStorageService.getSession('division'));
      // console.log(this.sessionStorageService.getSession('access'));

      this.notif.viewNotifications(this.sessionStorageService.getSession('division'), this.sessionStorageService.getSession('access'))
      .subscribe(res => {

        let result:any = res;
        this.notif.notificationContent = result;
      });
    });

    this.socket.on('updatePRTable', (data: any) => {
      this.pr.loadPR()
      .subscribe(res => {
        let result:any = res;
        if (this.pr.dataSourcePRTable !== undefined && this.pr.dataSourcePRTable !== null) {
          this.pr.dataSourcePRTable.data = result;
        }
      });

    });

    this.socket.on('updateSmartMeters', (data: any) => {
      let result:any = JSON.parse(data);

      // if (this.smartmeter.dataSource !== undefined && this.smartmeter.dataSource !== null) {
      //   this.smartmeter.dataSource.data = result;
      // }
    });

    this.socket.on('broadcastWeatherInformation', (data: any) => {
      let result:any = JSON.parse(data);
      this.weatherInfo.City = result[0].city;
      this.weatherInfo.Country = result[0].country;
      this.weatherInfo.Temperature = result[0].temperature;
      console.log(this.weatherInfo);
    });

    this.socket.on('updateWaterRates', (data: any) => {
      let result:any = JSON.parse(data);
      // if (this.rate.dataSource !== undefined && this.rate.dataSource !== null) {
      //   this.rate.dataSource.data = result;
      // }
    });

    this.disconnectSocket();
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  sendNotif(message) {
    return this.socket.emit('message', message);
  }

  updatePRTable() {
    let sql:string = 'PR TABLE';

    return this.socket.emit('updatePRTable', sql);
  }

  updateNotification() {
    let sql:string = 'test';


  //   if (role == "Approver") {
  //      sql = `SELECT * FROM notifications WHERE notif_division = '${division}' and notif_status = 'For Approve' ORDER BY notif_id DESC`;
  //   } else if (role == "Encoder") {
  //      sql = `SELECT * FROM notifications WHERE notif_division = '${division}' ORDER BY notif_id DESC`;
  //   } else if (role == "Budget") {
  //      sql = `SELECT * FROM notifications WHERE notif_status = 'For Budget Checking' ORDER BY notif_id DESC`;
  //   } else if (role == "Cash") {
  //     sql = `SELECT * FROM notifications WHERE notif_status = 'For Cash' ORDER BY notif_id DESC`;
  //  }

    return this.socket.emit('notifications', sql);
  }

  // updateApprovePR(status, division) {
  //   const query = `SELECT * FROM Pr_details WHERE pr_status='${status}' AND pr_division='${division}'`;
  //   return this.socket.emit('updateApprovePR', query);
  // }

  updateApprovePR() {
    return this.socket.emit('updateApprovePR', 'working');
  }

  broadcastWeatherInformation() {
    const query = "SELECT * FROM WeatherInformation";
    return this.socket.emit('broadcastWeatherInformation', query);
  }
}
