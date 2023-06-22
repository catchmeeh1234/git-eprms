import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { API_URL } from '../constants';
import { observable } from 'rxjs';
import { StringDecoder } from 'string_decoder';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PrService {
  public dataSource:any;
  public dataSourcePRTable:any;

  public prnumber:string;
  public message:string;
  private statusColor:string;

  constructor(private http:HttpClient,
              private sessionStorageService:SessionStorageService,
  ) { }

  loadPR() {
    let div = this.sessionStorageService.getSession('division');
    let role = this.sessionStorageService.getSession('access');

    return this.http.get(`${API_URL}/api/pr.php?division=${div}&role=${role}`, {responseType: 'json'});
  }

  loadPRNo() {
    return this.http.get(API_URL + '/api/prno.php', {responseType: 'text'});
  }

  loadItems(prnum) {
    return this.http.get(API_URL + `/api/pritems.php?prnum=${prnum}`, {responseType: 'json'});
  }

  getPurpose(prnum) {
    return this.http.get(API_URL + `/api/getPurpose.php?prnum=${prnum}`, {responseType: 'json'});
  }

  approvePr(div, access) {
    return this.http.get(API_URL + `/api/approvepr.php?div=${div}&role=${access}`, {responseType: 'json'});
  }

  // updateApproveStatus(prnum, status, username, button) {
  //   return this.http.get(API_URL + `/prApproveStatus.php?prnum=${prnum}&status=${status}&name=${username}&stat=${button}`, {responseType: 'text'});
  // }

  telLDisapprove(prnum) {
    return this.http.get(API_URL + `/api/telLDisapprove.php?prnum=${prnum}`, {responseType: 'json'});
  }

  prHistory(prnum) {
    return this.http.get(API_URL + `/api/prHistory.php?prnum=${prnum}`, {responseType: 'json'});
  }

  loadTotalAS() {
    return this.http.get(API_URL + '/api/LoadTotalAS.php', {responseType: 'text'});
  }

  loadTotalEM() {
    return this.http.get(API_URL + '/api/loadTotalEC.php', {responseType: 'text'});
  }

  loadTotalFC() {
    return this.http.get(API_URL + '/api/loadTotalFC.php', {responseType: 'text'});
  }

  loadTotalPR() {
    return this.http.get(API_URL + '/api/loadTotalPR.php', {responseType: 'text'});
  }

  loadDocumentCounter(division:string) {
    return this.http.get(API_URL + `/loadDocumentCounter.php?division=${division}`, {responseType: 'text'});
  }

  //addPR(prno:string, datecreated:string, requestor:string, designation:string, division:string, purpose:string, prstatus:string) {
  addPR(prno:string, datecreated:string, requestor:string, designation:string, division:string, purpose:string, prstatus:string, items:any, username:string) {
    let json = JSON.stringify(items);
    let params = new FormData();
    params.append('prno', prno);
    params.append('datecreated', datecreated);
    params.append('requestor', requestor);
    params.append('designation', designation);
    params.append('division', division);
    params.append('purpose', purpose);
    params.append('prstatus', prstatus);
    params.append('items', json);
    params.append('username', username);

    return this.http.post(API_URL +'/addPR.php', params, { responseType: 'text'});
  }

  editPR(prDetails:any, numberofitems) {
    let params = new FormData();
    let json = JSON.stringify(prDetails);
    params.append('details', json);
    params.append('number_of_items', numberofitems);

    return this.http.post(API_URL +'/editPR.php', params, { responseType: 'text'});
  }

  getUnitMeasurements() {
    return this.http.get(API_URL + `/viewUnits.php`, {responseType: 'json'});
  }

  getDivisions() {
    return this.http.get(API_URL + `/viewDivisions.php`, {responseType: 'json'});
  }

  updatePrRequestAPI(prDetails:any) {
    return this.http.post(API_URL + `/cancelPR.php`, prDetails, {responseType: 'json'});
  }
  loadPrAndItems(prno:string) {
    console.log(prno);
    return this.http.get(API_URL + `/loadPrAndItems.php?prno=${prno}`, {responseType: 'json'});
  }

  //* monthly total pr */
  PRTotalJan() {
    return this.http.get(API_URL + '/api/JanTotalPR.php', {responseType: 'json'});
  }
}
