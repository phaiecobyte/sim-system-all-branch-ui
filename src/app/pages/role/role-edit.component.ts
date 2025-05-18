import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';
import { Role, RoleService } from './role.service';

@Component({
  selector: 'app-category-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Edit' | translate }}{{ 'Role' | translate }}</span>
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
export class RoleEditComponent implements OnInit {
  readonly modalData: any = inject(NZ_MODAL_DATA);
  autoTips = CommonValidators.autoTips;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Role | null = null;


  constructor(
    protected modal: NzModalRef<RoleEditComponent>,
    private fb: FormBuilder,
    private service: RoleService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControls();
    if (this.modalData.id) {
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Role) => {
          console.log('model:', model);
          this.model = model;
          this.setFormValue(model);
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
    }
  }

  public initControls(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      name: [null, [required]],
      nameKh: [null],
      imageUrl: [null],
      categoryMainId: [0],
    });
  }

  public setFormValue(model: Role) {
    if (this.frm) {
      this.frm.patchValue({
        name: model.name,
        nameKh: model.nameKh,
        description:model.description
      });
      this.isLoading = false;
    }
  }

  public onSubmit = () => {
    if (this.frm.valid) {
      const payload = {
        ...this.frm.value,
        id: this.model?.id,
      };
      this.service.edit(payload).subscribe({
        next: (role: Role) => {
          console.log('role List:', role);
          this.model = role;
          this.notification.showEditSuccess();
        },
        error: (error) => {
          console.log(error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        },
      });
    }
  };
  public closeModal = () => {
    this.modal.close();
  };
}
