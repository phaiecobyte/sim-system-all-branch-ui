import { Injectable } from "@angular/core"
import { BaseApiService } from "../../shared/services/base-api.service"
import { HttpClient } from "@angular/common/http"

export interface Template{
  id?: number
  name?: string
  templateHtml?: string
}

@Injectable({
  providedIn:'root'
})

export class InvoiceTemplateService extends BaseApiService<Template>{
  constructor(http:HttpClient){
    super('template',http)
  }

  getAll(){
    return this.http.get('http://34.126.152.101:6061/api/template');
  }
}
