import { Injectable } from "@angular/core"
import { BaseApiService } from "../../shared/services/base-api.service"
import { HttpClient } from "@angular/common/http"

export interface Employee {
  id?: number
  employeeId?: string
  fullName?: string
  fullNameKh?: string
  sex?: string
  address?: string
  phone?: string
  imageUrl?: string
  cvUrl?: string
  roleId?: number
  roleName?: string
  roleNameKh?: string
}

@Injectable({
  providedIn:'root'
})

export class EmployeeService extends BaseApiService<Employee>{
  constructor(http:HttpClient){
    super('employee',http)
  }
}
