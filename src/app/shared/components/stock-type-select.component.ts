import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone:false,
  selector: 'app-stock-type-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StockTypeSelectComponent),
      multi: true,
    },
  ],
  template: `
    <nz-select
      [(ngModel)]="selectValue"
      (ngModelChange)="onChange()"
      [nzDisabled]="disabled"
    >
      <nz-option
        *ngFor="let stockType of stockTypeList"
        [nzLabel]="stockType.label"
        [nzValue]="stockType.value"
      ></nz-option>
    </nz-select>
  `,
})
export class StockTypeSelectComponent implements ControlValueAccessor {
  @Output() valueChange = new EventEmitter<string>();

  selectValue: string = '';
  disabled: boolean = false;

  stockTypeList = [
    { label: 'Cut Stock', value: 'Cut Stock' },
    { label: 'Not Cut Stock', value: 'Not Cut Stock' },
  ];

  onChangeCallback: any = () => {};
  onTouchedCallback: any = () => {};

  onChange() {
    this.valueChange.emit(this.selectValue);
    this.onChangeCallback(this.selectValue);
    this.onTouchedCallback();
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

  writeValue(value: any): void {
    this.selectValue = value;
  }
}
