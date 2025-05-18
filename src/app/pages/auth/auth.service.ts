import {HttpClient} from "@angular/common/http";
import {EventEmitter, Injectable} from "@angular/core";
import {APP_STORAGE_KEY} from "../../const";
import {map} from "rxjs";
import {SettingService} from '../../app-setting';
import {LocalstorageService} from '../../shared/services/localstorage.service';

export interface ClientInfo{
  id?: number
  username?: string
  fullName?: string
  phone?: string
  email?: string
  profile?: string
  token?: string
  refreshToken?: string
  roleIds?: number[]
}

export interface Register {
  username?: string
  fullName?: string
  phone?: string
  email?: string
  profile?: string
  password?: string
}

export enum AUTH_TYPE{
  ADMIN = 1,
  CUSTOMER = 2,
}


@Injectable({providedIn: 'root'})
export class AuthService{

  clientInfo: ClientInfo;

  constructor(
    private httpClient:HttpClient,
    private settingService: SettingService,
    private localstorageService: LocalstorageService
  ){
    this.clientInfo = this.localstorageService.getValue(APP_STORAGE_KEY.AUTHORIZED);
  }

  refresher: EventEmitter<any> = new EventEmitter<any>();


  get url(){
    return this.settingService.setting.BASE_API_URL;
  }

  login(model: any){
    return this.httpClient.post(`${this.url}/auth/login`, model).pipe(map(result => {
      this.localstorageService.setValue({key: APP_STORAGE_KEY.AUTHORIZED, value: result});
      this.clientInfo = result;
      return result;
    }));
  }

  logout(key: string){
    return this.httpClient.post(`${this.url}/auth/logout`, { withCredentials: true}).pipe(map(result => {
      this.localstorageService.removeValue(key);
      this.clientInfo = {};
      return result;
    }))
  }

  register(model: Register){
    return this.httpClient.post(`${this.url}/auth/register`, model, { withCredentials: true});
  }

  getUserInfo(){
    return this.httpClient.get(`${this.url}/auth/info`).pipe(map(result => {
      return result;
    }))
  }

  refreshToken(accessToken: string){
    return this.httpClient.post(`${this.url}/auth/refresh`,
      {accessToken},
      {
        headers: {'disableErrorNotification': 'yes', },
        withCredentials: true
      });
  }
}
