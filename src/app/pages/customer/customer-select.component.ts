import {Component, EventEmitter, forwardRef, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {QueryParam} from '../../shared/services/base-api.service';
import { Customer, CustomerService } from './customer.service';

@Component({
  selector: 'app-customer-select',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomerSelectComponent),
    multi: true,
  }],
  template: `
    <nz-select
      [(ngModel)]="selectValue"
      (ngModelChange)="onChange()"
      [nzLoading]="isLoading"
      [nzDisabled]="disabled"
    >
      <nz-option
        *ngFor="let item of list"
        [nzLabel]="item.name"
        [nzValue]="item.id"
      ></nz-option>
    </nz-select>
  `,
  standalone: false
})


export class CustomerSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private service: CustomerService
  ) {}

  @Output() valueChange = new EventEmitter();
  isLoading: boolean = false;
  selectValue: number = 0;
  disabled: boolean = false;
  list: Customer[] = [];
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 9999,
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
    this.service.search(this.param).subscribe({
      next: (result:{results: Customer[]}) => {
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
