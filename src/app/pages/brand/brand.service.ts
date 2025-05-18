import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";

export interface Brand{
  id?: number
  name?: string
  nameKh?: string
  shortName?: string
  imageUrl?: string
}

@Injectable({
  providedIn:'root'
})
export class BrandService extends BaseApiService<Brand>{
  constructor(http:HttpClient){
    super('brand',http)
  }

}
