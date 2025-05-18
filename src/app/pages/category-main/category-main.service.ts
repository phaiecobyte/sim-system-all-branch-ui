import {Injectable} from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {HttpClient} from '@angular/common/http';

export interface CategoryMain {
  id?: number
  name?: string
  shortName?: string
}

@Injectable({
  providedIn: 'root'
})

export class CategoryMainService extends BaseApiService<CategoryMain>{
  constructor(http: HttpClient) {
    super('categorymain', http);
  }
}
