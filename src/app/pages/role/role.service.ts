import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";

export interface Role {
  id?: number
  name?: string
  nameKh?:string
  description?:string
  createdDate?:string
}

@Injectable({
  providedIn:'root'
})
export class RoleService extends BaseApiService<Role>{
  constructor(http:HttpClient){
    super('role',http)
  }
}
