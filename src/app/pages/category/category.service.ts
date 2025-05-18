import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseApiService} from '../../shared/services/base-api.service';

export interface Category {
  id?: number
  name?: string
  nameKh?: string
  remark?: string
  printerId?: number
  categoryMainId?: number
  imageUrl?:string
}

@Injectable({
  providedIn: 'root'
})

export class CategoryService extends BaseApiService<Category>{
  constructor(http: HttpClient) {
    super('category',http);
  }
}
