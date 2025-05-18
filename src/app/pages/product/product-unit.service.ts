import { Injectable } from "@angular/core";
import { BaseApiService } from "../../shared/services/base-api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ProductUnit{
  id?: number
  productId?: number
  name:string
  unitTypeName:string
  unitTypeId?: number
  cost?: number,
  price?: 0,
  typeDefault?: boolean,
  costOld?: number,
  qtyOld?: number
}

@Injectable({
  providedIn:'root'
})

export class ProductUnitService extends BaseApiService<ProductUnit>
{
  constructor(http:HttpClient){
    super('productunit',http);
  }
  getUnitsByProductId(productId: number): Observable<ProductUnit[]> {
    return this.http.get<ProductUnit[]>(`${this.apiUrl}/product/${productId}`);
  }
}
