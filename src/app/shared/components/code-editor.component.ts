import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NzCodeEditorModule],
  template: `
    <nz-code-editor
      [(ngModel)]="value"
      [nzEditorOption]="editorOptions"
      (ngModelChange)="onValueChange($event)"
      [style.height]="height"
      style="width: 100%;">
    </nz-code-editor>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeEditorComponent),
      multi: true
    }
  ]
})
export class CodeEditorComponent implements ControlValueAccessor, OnInit {
  @Input() language: string = 'html';
  @Input() theme: string = 'vs';
  @Input() height: string = '400px';

  value: string = '';
  editorOptions: any = {};

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.editorOptions = {
      language: this.language,
      theme: this.theme,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      readOnly: false
    };
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.editorOptions = {
      ...this.editorOptions,
      readOnly: isDisabled
    };
  }
}
