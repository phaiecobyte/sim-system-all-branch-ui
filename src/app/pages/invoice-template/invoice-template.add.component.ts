import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InvoiceTemplateService, Template } from './invoice-template.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-invoice-template-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Add' | translate }}</span>
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
          <nz-form-label nzRequired [nzSm]="6" [nzXs]="24"
            >Invoice TemplateHtml</nz-form-label
          >
          <nz-form-control [nzSm]="14" [nzXs]="24" nzRequired>
            <textarea nz-input formControlName="templateHtml" id="templateHtml" name="templateHtml" [nzAutosize]="true" placeholder=""></textarea>
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
  encapsulation: ViewEncapsulation.None,
  standalone: false,

})
export class InvoiceTemplateAddComponent implements OnInit {
  autoTips = CommonValidators.autoTips;
  frm!: FormGroup;
  model: Template;
  readonly modalData: any = inject(NZ_MODAL_DATA);
  isLoading: boolean = false;
  editorOptions = {
    language: 'typescript',
    theme: 'vs-light',
    automaticLayout: true,
  };

  constructor(
    private fb: FormBuilder,
    protected modal: NzModalRef<InvoiceTemplateAddComponent>,
    private service: InvoiceTemplateService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControls();
  }

  initControls(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      name: ['', [required]],
      templateHtml: ['', [required]],
    });
  }

  onSubmit() {
      if (this.frm.valid) {
        this.isLoading = true;
        this.service.add(this.frm.value).subscribe({
          next: (template: Template) => {
            console.log('template', template);
            this.model = template;
            this.notification.showAddSuccess();
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
