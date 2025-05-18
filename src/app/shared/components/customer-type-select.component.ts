import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone:false,
  selector: 'app-customerType-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerTypeSelectComponent),
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
        *ngFor="let gender of genderList"
        [nzLabel]="gender.label"
        [nzValue]="gender.value"
      ></nz-option>
    </nz-select>
  `,
})
export class CustomerTypeSelectComponent implements ControlValueAccessor {
  @Output() valueChange = new EventEmitter<string>();

  selectValue: string = '';
  disabled: boolean = false;

  genderList = [
    { label: 'RETAIL', value: 'RETAIL' },
    { label: 'DEALER', value: 'DEALER' },
    { label: 'SHOW ROOM', value: 'SHOW ROOM' },
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
