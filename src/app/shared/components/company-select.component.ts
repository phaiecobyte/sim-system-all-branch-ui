import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone:false,
  selector: 'app-company-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanySelectComponent),
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
        *ngFor="let company of companyList"
        [nzLabel]="company.label"
        [nzValue]="company.value"
      ></nz-option>
    </nz-select>
  `,
})
export class CompanySelectComponent implements ControlValueAccessor {
  @Output() valueChange = new EventEmitter<string>();

  selectValue: string = '';
  disabled: boolean = false;

  companyList = [
    { label: 'SIM', value: 1 }
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
