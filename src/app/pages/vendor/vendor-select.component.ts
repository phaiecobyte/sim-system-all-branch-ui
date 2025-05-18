import {Component, EventEmitter, forwardRef, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {QueryParam} from '../../shared/services/base-api.service';
import { Vendor, VendorService } from './vendor.service';

@Component({
  selector: 'app-vendor-select',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VendorSelectComponent),
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
        [nzLabel]="item.supplierName"
        [nzValue]="item.id"
      ></nz-option>
    </nz-select>
  `,
  standalone: false
})


export class VendorSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private service: VendorService
  ) {}

  @Output() valueChange = new EventEmitter();
  isLoading: boolean = false;
  selectValue: number = 0;
  disabled: boolean = false;
  list: Vendor[] = [];
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
      next: (result:{results: Vendor[]}) => {
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
