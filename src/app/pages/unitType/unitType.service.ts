import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";

export interface UnitType{
  id?:number
  name?: string
  nameKh?: string
  qty?: number
  unitQty?: boolean
}

@Injectable({
  providedIn:'root'
})

export class UnitTypeService extends BaseApiService<UnitType>{
  constructor(http:HttpClient){
    super('unittype',http)
  }

}
