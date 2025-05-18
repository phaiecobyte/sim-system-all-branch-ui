import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';
import { Employee, EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Add' | translate }}{{ 'Employee' | translate }}</span>
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
            <input nz-input formControlName="fullnameKh" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{
            'Fullname in Latin' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="fullname" />
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
                    [(nzFileList)]="fileImageList"
                    (nzChange)="handleImageUpload($event)"
                    [nzShowButton]="fileImageList.length < 1"
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
                    [(nzFileList)]="fileCvList"
                    (nzChange)="handleCvUpload($event)"
                    [nzShowButton]="fileCvList.length < 1"
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
export class EmployeeAddComponent implements OnInit {
  constructor(
    protected modal: NzModalRef<EmployeeAddComponent>,
    private fb: FormBuilder,
    private service: EmployeeService,
    private notification: NotificationService
  ) {}

  autoTips = CommonValidators.autoTips;
  isLoading: boolean = false;
  fileImageList: NzUploadFile[] = [];
  fileCvList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Employee;
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  ngOnInit(): void {
    this.initControl();
  }

  initControl() {
    const { required, singlePhoneValidator } = CommonValidators;
    this.frm = this.fb.group({
      fullname: [null, [required]],
      fullnameKh: [null, [required]],
      sex: [null, [required]],
      roleId: [null],
      phone: [null, [required, singlePhoneValidator]],
      address: [null, [required]],
      cvUrl: [null],
      imageUrl: [null],
    });
  }

  handleImageUpload(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.fileImageList = fileList;
    this.frm.get('imageUrl').patchValue(fileList[0]?.url);
  }

  handleCvUpload(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Limit to 1 file for CV
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    this.fileCvList = fileList;
    this.frm.get('cvUrl').patchValue(fileList[0]?.url);
  }

  onSubmit() {
    if (this.frm.valid) {
      this.isLoading = true;

      console.log(this.frm.getRawValue());

      this.service.add(this.frm.value).subscribe({
        next: (employee: Employee) => {
          console.log('Employee', employee);
          this.model = employee;
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
