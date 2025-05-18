import { HttpClient } from "@angular/common/http"
import { BaseApiService } from "../../shared/services/base-api.service"

export interface PaymentMethod {
  id?: number
  methodName?: string
  type?: string
  warehouseID?: number
  accountNo?: string
  accountName?: string
  amount?: number
}

export class PaymentMethodService extends BaseApiService<PaymentMethod>{
  constructor(http:HttpClient){
    super('paymentmethod',http)
  }
}
