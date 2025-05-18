import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { Role, RoleService } from './role.service';

@Component({
  selector: 'app-role-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Add' | translate }}{{ 'Role' | translate }}</span>
    </div>
    <div class="modal-content">
      <nz-spin
        *ngIf="isLoading"
        nzSimple
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"
      ></nz-spin>
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Position' | translate}}{{'Khmer' | translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="nameKh" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Position' | translate
          }}ជាភាសារអង់គ្លេស</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            'Description' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea
              nz-input
              rows="3"
              formControlName="description"
            ></textarea>
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
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RoleAddComponent implements OnInit {
  constructor(
    protected modal: NzModalRef<RoleAddComponent>,
    private fb: FormBuilder,
    private service: RoleService
  ) {}

  autoTips = CommonValidators.autoTips;
  isLoading: boolean = false;
  frm!: FormGroup;
  model: Role={}

  ngOnInit(): void {
    this.initControl();
  }

  initControl() {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      name: [null, required],
      nameKh:[null],
      description: [null],
      createdDate: [null],
    });
  }

  onSubmit() {
    if (this.frm.valid) {
      this.isLoading = true;
      console.log(this.frm.getRawValue());
      this.service.add(this.frm.value).subscribe({
        next: (role: Role) => {
          console.log('Role', role);
          this.model = role;
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
