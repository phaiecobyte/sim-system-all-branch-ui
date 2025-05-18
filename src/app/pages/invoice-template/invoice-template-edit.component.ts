import { Component, inject, OnInit, ViewEncapsulation, importProvidersFrom, NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InvoiceTemplateService, Template } from './invoice-template.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-invoice-template-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Edit' | translate }}</span>
    </div>
    <div class="modal-content">
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Name' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzRequired [nzSm]="6" [nzXs]="24">Invoice TemplateHtml</nz-form-label>
          <nz-form-control nzSpan="1-24">
            <nz-text-edit/>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">
          {{ 'Cancel' | translate }}
        </button>
        <button
          nz-button
          (click)="onSubmit()"
          [disabled]="!frm.valid"
          type="submit"
          nzType="primary"
        >
          {{ 'Save' | translate }}
        </button>
      </div>
    </div>

  `,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  standalone: false,
})

export class InvoiceTemplateEditComponent implements OnInit {
  protected readonly importProvidersFrom = importProvidersFrom;
  protected readonly CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
  autoTips = CommonValidators.autoTips;
  frm!: FormGroup;
  model: Template;
  readonly modalData: any = inject(NZ_MODAL_DATA);
  isLoading: boolean = false;
  editorOptions = {
    language: 'html',
    theme: 'vs-light',
    automaticLayout: true,
    minimap: { enabled: false },
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly: false
  };

  constructor(
    private fb: FormBuilder,
    protected modal: NzModalRef<InvoiceTemplateEditComponent>,
    private service: InvoiceTemplateService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControls();
    if (this.modalData.id) {
      this.service.find(this.modalData.id).subscribe({
        next: (model: Template) => {
          this.model = model;
          this.setFormValue(model);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  initControls(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      name: ['', [required]],
      templateHtml: ['', [required]],
    });
  }

  setFormValue(model: Template): void {
    this.frm.patchValue({
      name: model.name,
      templateHtml: model.templateHtml,
    });
  }

  onSubmit() {
    if (this.frm.valid) {
      this.service.edit({ ...this.frm.value, id: this.model.id }).subscribe({
        next: (template: Template) => {
          console.log('template', template);
          this.model = template;
          this.notification.showEditSuccess();
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        },
      });
    }
  }

  closeModal() {
    this.modal.close();
  }
}
