import { Component, enableProdMode, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';
import { Employee, EmployeeService } from './employee.service';
import { Product } from '../product/product.service';

@Component({
  selector: 'app-employee-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Edit' | translate }}{{ 'Employee' | translate }}</span>
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
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Fullname in Khmer' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="fullNameKh" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Fullname in Latin' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="fullName" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Phone' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="phone" />
          </nz-form-control>
        </nz-form-item>
        <div nz-row>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label [nzSm]="12" [nzXs]="24" nzRequired>{{
                'Gender' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="8" [nzXs]="24">
                <app-gender-select formControlName="sex" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item  nzFlex>
                <nz-form-label [nzSm]="6" nzXs="24">
                  តួនាទី
                </nz-form-label>
                <nz-form-control [nzSm]="10" nzXs="24">
                  <app-role-select formControlName="roleId"/>
                </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div nz-row>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label [nzSm]="12" [nzXs]="24">{{
                'Image' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <div class="photo">
                  <nz-upload
                    [nzShowUploadList]="nzShowUploadList"
                    [nzAction]="uploadUrl"
                    nzListType="picture-card"
                    [(nzFileList)]="fileList"
                    (nzChange)="handleChangeFile($event)"
                    [nzShowButton]="fileList.length < 1"
                  >
                    <div>
                      <span nz-icon nzType="plus"></span>
                      <div>{{ 'Upload' | translate }}</div>
                    </div>
                  </nz-upload>
                </div>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label [nzSm]="6" [nzXs]="24">{{
                'CV' | translate
              }}</nz-form-label>
              <nz-form-control [nzSm]="14" [nzXs]="24">
                <div class="photo">
                  <nz-upload
                    [nzShowUploadList]="nzShowUploadList"
                    [nzAction]="uploadUrl"
                    nzListType="picture-card"


                  >
                    <div>
                      <span nz-icon nzType="plus"></span>
                      <div>{{ 'Upload' | translate }}</div>
                    </div>
                  </nz-upload>
                </div>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Address' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input rows="3" formControlName="address"></textarea>
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

export class EmployeeEditComponent implements OnInit {
  readonly modalData: any = inject(NZ_MODAL_DATA);
  autoTips = CommonValidators.autoTips;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Employee;
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  constructor(
    protected modal: NzModalRef<EmployeeEditComponent>,
    private fb: FormBuilder,
    private service: EmployeeService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControl();
    if (this.modalData.id) {
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Employee) => {
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

  initControl() {
    const { required, singlePhoneValidator } = CommonValidators;
    this.frm = this.fb.group({
      fullName: [null, [required]],
      fullNameKh: [null, [required]],
      sex: [null, [required]],
      roleId: [null],
      phone: [null, [required, singlePhoneValidator]],
      address: [null, [required]],
      cvUrl: [null],
      imageUrl: [null],
    });
  }

  setFormValue(model: Employee) {
    console.log('Original imageUrl:', model.imageUrl);
    const parsedImageUrl = this.parseImageUrl(model.imageUrl);
    console.log('Parsed imageUrl:', parsedImageUrl);
    if (this.frm) {
      this.frm.patchValue({
        fullName:model.fullName,
        fullNameKh:model.fullNameKh,
        sex:model.sex,
        address:model.address,
        phone:model.phone,
        roleId:model.roleId,
        cvUrl:model.cvUrl,
        imageUrl:model.imageUrl
      });
      if (parsedImageUrl) {
        this.fileList = [
          {
            uid: '-1',
            name: 'Uploaded Image',
            status: 'done',
            url: parsedImageUrl,
          },
        ];
      }
      this.isLoading = false;
      console.log("form value:",this.frm.value)
    }
  }
  handleChangeFile = (info: NzUploadChangeParam) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-10);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    console.log('Upload file list: ', fileList);
    this.frm.get('imageUrl').patchValue(fileList[0]?.url);
    this.fileList = fileList;
  };

  public parseImageUrl(imageUrl: string | null): string | undefined {
    if (!imageUrl) return undefined;
    try {
      const parsed = JSON.parse(imageUrl);
      return parsed?.url || imageUrl;
    } catch {
      return imageUrl;
    }
  }
  public onSubmit = () => {
    if (this.frm.valid) {
      const payload = {
        ...this.frm.value,
        id: this.model?.id,
      };

      if (!payload.imageUrl) {
        payload.imageUrl = null;
      }

      this.service.edit(payload).subscribe({
        next: (employee: Employee) => {
          console.log('employee:', employee);
          this.model = employee;
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
