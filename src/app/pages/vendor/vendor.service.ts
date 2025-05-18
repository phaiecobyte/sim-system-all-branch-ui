import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";

export interface Vendor {
  id?:number,
  warehouseId?:number,
  supplierName?:string,
  sex?:string,
  contactName?:string,
  contactPhone?:string,
  address?:string,
  description?:string
}

@Injectable({
  providedIn:'root'
})
export class VendorService extends BaseApiService<Vendor>{

  constructor(http:HttpClient){
    super('supplier',http)
  }

}
