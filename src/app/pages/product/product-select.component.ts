import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {QueryParam} from '../../shared/services/base-api.service';
import { ItemService, Product } from './product.service';

@Component({
  selector: 'app-product-select',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductSelectComponent),
    multi: true,
  }],
  template: `
    <nz-select
      [(ngModel)]="selectValue"
      (ngModelChange)="onChange()"
      [nzLoading]="isLoading"
      [nzDisabled]="disabled"
      nzShowSearch
      [nzServerSearch]="true"
      (nzOnSearch)="textSearch = $event;param.pageIndex = 1; onSearch();"
    >
      <nz-option
        *ngFor="let item of list"
        [nzLabel]="item.name + ''"
        nzCustomContent
        [nzValue]="item.id"
      >
        <b>{{ item.code }}</b>
        <span>{{ item.name }}</span>
      </nz-option>
    </nz-select>
  `,
  standalone: false,
  styles: [`
    b{
      font-size: 13px;
      padding-right: 4px;
    }

  `]
})


export class ProductSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private service: ItemService
  ) {}
  @Input() categoryId: number = 0;
  @Output() valueChange = new EventEmitter();
  isLoading: boolean = false;
  textSearch: string = "";
  selectValue: number = 0;
  disabled: boolean = false;
  list: Product[] = [];
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 500,
    sorts: '',
    filters: ''
  }

  onChangeCallback: any = () => {
  };
  onTouchedCallback: any = () => {
  };

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(){
    this.isLoading = true;
    this.param.filters = JSON.stringify([{
      field: 'name',
      operator: 'contains',
      value: this.textSearch,
    }]);
    if (this.textSearch && this.param.pageIndex === 1) {
      this.list = [];
    }
    this.service.search(this.param).subscribe({
      next: (result:{results: Product[]}) => {
        this.list = result.results;
        this.isLoading = false;
      },
      error: err => {
        console.log(err)
      }
    })
  }

  onChange(){
    this.valueChange.emit(this.selectValue);
    this.onChangeCallback(this.selectValue);
    this.onTouchedCallback(this.selectValue);
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.selectValue = obj;
  }
}

