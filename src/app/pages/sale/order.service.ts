import {Injectable} from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  warehouseName: string;
  paymentMethodName: string;
  customerId: number;
  warehouseId: number;
  paymentMethodId: number;
  exchangeId: number;
  date: string;
  orderDate: string;
  deposit: number;
  discount: number;
  amount: number;
  refer: number;
  cancelDate: string | null;
  credit: string | null;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  orderID: number;
  productID: number;
  colorCode: string;
  unitTypeID: number;
  productUnitId: number;
  qty: number;
  unitQty: number;
  unitStock: number;
  price: number;
  cost: number;
  discount: number;
  paid: boolean;
  productSpecification: string;
}

// Create interface for adding new order
export interface CreateOrderRequest {
  id: number;
  customerId: number;
  warehouseId: number;
  paymentMethodId: number;
  exchangeId: number;
  date: string;
  orderDate: string;
  deposit: number;
  discount: number;
  amount: number;
  refer: number;
  cancelDate: string | null;
  credit: string | null;
  orderDetails: CreateOrderDetailRequest[];
}

export interface CreateOrderDetailRequest {
  id: number;
  orderID: number;
  productID: number;
  colorCode: string;
  unitTypeID: number;
  productUnitId: number;
  qty: number;
  unitQty: number;
  unitStock: number;
  price: number;
  cost: number;
  discount: number;
  paid: boolean;
  productSpecification: string;
}

export interface OrderSummary{
  orderId?: number
  customerName?: string
  warehouseName?: string
  paymentMethodName?: string
  date?: string
  amount?: number
}

@Injectable({
  providedIn: 'root'
})

export class OrderService extends BaseApiService<Order>{
  constructor(http: HttpClient) {
    super('order', http);
  }

  getPublicViewUrl(id: number) {
    return `${this.apiUrl}/public/${id}`;
  }

  public checkUrlValidity(url: any) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Accept', 'text/html')
      .set('disableErrorNotification', 'yes');
    return this.http.get(url, { headers: headers, responseType: 'text' });
  }

  getOrderSummary(startDate: string, endDate: string): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.apiUrl}/get-order-summary?startDate=${startDate}&endDate=${endDate}`);
  }

}