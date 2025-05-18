import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone:false,
  selector: 'app-gender-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenderSelectComponent),
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
export class GenderSelectComponent implements ControlValueAccessor {
  @Output() valueChange = new EventEmitter<string>();

  selectValue: string = '';
  disabled: boolean = false;

  genderList = [
    { label: 'ប្រុស', value: 'M' },
    { label: 'ស្រី', value: 'F' },
    { label: 'មិនមាន', value: 'NULL' },
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
