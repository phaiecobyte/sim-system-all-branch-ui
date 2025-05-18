import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";

export interface User{
  id?: number
  userId?: string
  staffId?: string
  fullName?: string
  phone?: string
  email?: string
  profile?: string
  warehouseId?: number
  roleId?: number
  username?: string
  password?: string
  expireDate?: string
  amount?: number
  amountKh?: number
  amountBank?: number
}

@Injectable({
  providedIn:'root'
})

export class UserService extends BaseApiService<User>{
  constructor(http:HttpClient){
    super('auth',http)
  }
}
