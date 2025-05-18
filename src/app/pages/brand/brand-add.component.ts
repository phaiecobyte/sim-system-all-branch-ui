import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonValidators} from '../../shared/services/common-validators';
import {NzUploadChangeParam, NzUploadFile} from 'ng-zorro-antd/upload';
import { Brand, BrandService } from './brand.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-brand-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Add' | translate}}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="isLoading" nzSimple style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"></nz-spin>
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ 'Name' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Short Name' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="shortName" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'NameKh'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="nameKh"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Image'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <div class="photo">
              <nz-upload
                [nzShowUploadList]="nzShowUploadList"
                [nzAction]="uploadUrl"
                nzListType="picture-card"
                [(nzFileList)]="fileList"
                (nzChange)="handleUploadFiles($event)"
                [nzShowButton]="fileList.length < 1"
                formControlName="imageUrl"
              >
                <div>
                  <span nz-icon nzType="plus"></span>
                  <div>{{ 'Upload' | translate }}</div>
                </div>
              </nz-upload>
            </div>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">{{'Cancel' | translate}}</button>
        <button nz-button (click)="onSubmit()" [disabled]="!frm.valid" type="submit" nzType="primary">{{'Save' | translate}}</button>
      </div>
    </div>
  `,
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class BrandAddComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<BrandAddComponent>,
    private fb: FormBuilder,
    private  service: BrandService,
    private notification:NotificationService,
  ) {
  }

  autoTips = CommonValidators.autoTips;
  isLoading:boolean = false;
  fileList: NzUploadFile[] = []
  frm!: FormGroup;
  model: Brand = {};
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  ngOnInit(): void {
    this.initControl();
  }

  initControl(){
    const { required} = CommonValidators
    this.frm = this.fb.group({
      name: [null, [required]],
      shortName: [null],
      nameKh: [null],
      imageUrl: [null],
    })
  }

  handleUploadFiles(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    // 1. Limit 5 number of uploaded files
    fileList = fileList.slice(-10);
    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    console.log("Upload file list: ", fileList)
    this.frm.get('imageUrl').patchValue(fileList[0]?.url);
    this.fileList = fileList;
  }

  parseImageUrl(imageUrl: string): string | undefined {
    try {
      return JSON.parse(imageUrl)?.url;
    } catch {
      return imageUrl;
    }
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;

      console.log(this.frm.getRawValue());

      this.service.add(this.frm.value).subscribe({
        next: (brand: Brand) => {
          console.log("Brand",brand)
          this.model = brand;
          this.notification.showAddSuccess();
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        }
      })
    }
  }

  closeModal() {
    this.modal.close();
  }
}
