import { Injectable } from "@angular/core"
import { BaseApiService } from "../../shared/services/base-api.service"
import { HttpClient } from "@angular/common/http"

export interface Shipper{
  id?:number
  name?: string
  sex?: string
  contactName?: string
  contactPhone?: string
  address?: string
  warehouseId?: number
}

@Injectable({
  providedIn:'root'
})
export class ShipperService extends BaseApiService<Shipper>{
  constructor(http:HttpClient){
    super('shipper',http)
  }
}

