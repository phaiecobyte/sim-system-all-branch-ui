import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface QueryParam {
  pageIndex: number
  pageSize: number
  pageCount?: number
  rowCount?: number
  sorts?: string
  filters?: string
}

export interface ShardResult<T> {
  results: T[]
  param: QueryParam
}

export interface Filter {
  field: string
  operator: string
  value: string
  logic: string
  manual: boolean
  filters: string[]
}

@Injectable({
  providedIn: 'root'
})

export class BaseApiService<T> {
  constructor(
    @Inject('endpoint') protected endpoint: string,
    protected http: HttpClient
  ) { }

  get apiUrl(){
    return `http://34.126.152.101:6061/api/${(this.endpoint)}`;
    // return `http://localhost:5218/api/${(this.endpoint)}`;
  }

  search(param: QueryParam): Observable<ShardResult<T>>{
    return this.http.get<ShardResult<T>>(this.apiUrl, {
      headers: this.headers,
      params: new HttpParams()
        .append('pageIndex', param.pageIndex)
        .append('pageSize', param.pageSize)
        .append('sorts', param.sorts ?? '')
        .append('filters', param.filters  ?? '')
    })
  }

  find(id: number): Observable<T>{
    return this.http.get<T>(`${this.apiUrl}/${id}`, {
      headers: this.headers,
    })
  }

  add(model: T): Observable<T>{
    return this.http.post<T>(this.apiUrl, model, {
      headers: this.headers,
    })
  }

  edit(model: T): Observable<T>{
    return this.http.put<T>(`${this.apiUrl}`, model, {
      headers: this.headers,
    })
  }

  delete(model :any): Observable<T>{
    return this.http.delete<T>(`${this.apiUrl}`,
      {
        headers: this.headers,
        body: model
      },
    )
  }

  get headers(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1IiwidW5pcXVlX25hbWUiOiJvbnNpZGV0Iiwicm9sZSI6IjIiLCJuYmYiOjE3Mzg4NDY0MTYsImV4cCI6MTczODkzMjgxNiwiaWF0IjoxNzM4ODQ2NDE2fQ.DbSfoTqhkJRusFMbIQztM7_3GOgTD2ibIxhJGBcRkMDT4X4uckH_KwSG_PLQyOsAbS8GX40YaJA96cQrivC3hg'
    })
  }
}
