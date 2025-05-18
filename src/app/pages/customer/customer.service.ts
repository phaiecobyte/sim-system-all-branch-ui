import {Injectable} from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {HttpClient} from '@angular/common/http';


export interface Customer {
  id?: number
  warehouseId?: number
  receiverId?: number
  name?: string
  shortName?: string
  sex?: string
  phone?: string
  location?: string
  description?: string
  status?: string
  customerType?: string
}


@Injectable({
  providedIn: 'root'
})

export class CustomerService extends BaseApiService<Customer>{
    constructor(http: HttpClient) {
      super('customer',http);
    }
}
