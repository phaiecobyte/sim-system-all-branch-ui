import {Injectable} from '@angular/core';
import { BaseApiService } from '../../shared/services/base-api.service';
import { HttpClient } from '@angular/common/http';

export interface Branch{
  id?:number,
  code?: string
  name?: string
  ownerName?: string
  phone?: string
  address?: string
  warehouseTypeId?: string
  ownerId?: number
  tax?: boolean
}

@Injectable({
  providedIn: 'root'
})

export class BranchService extends BaseApiService<Branch>{
  constructor(http:HttpClient){
    super('warehouse',http)
  }
}
