import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api.service';

export interface Product {
  barcode: string
  code: string
  name: string
  qtyOnHand: number
  batchNo: string
  categoryId: number
  supplierId: number
  companyId: number
  brandId: number
  qtyAlert: number
  dayAlert: number
  un: number
  specification: string
  imageUrl: string
  stockType: string
  startBalance: number
  warehouseId: number
  oldMeterPerKg: number
  id: number
  productUnits: ProductUnit[]
}

export interface ProductUnit {
  productId: number
  name:string
  unitTypeId: number
  cost: number
  price: number
  typeDefault: boolean
  costOld: number
  qtyOld: number
  id: number
}

@Injectable({
  providedIn: 'root',
})
export class ItemService extends BaseApiService<Product>{
  constructor(http:HttpClient){
    super('product',http)
  }
}
