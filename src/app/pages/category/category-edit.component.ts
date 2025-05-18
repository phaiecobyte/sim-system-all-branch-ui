import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, CategoryService} from './category.service';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-category-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Edit' | translate }}{{ 'Category' | translate }}</span>
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
            'NameKh' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="nameKh" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24"
            >{{ 'Name' | translate }}{{ 'English' | translate }}</nz-form-label
          >
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            'Image' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <nz-upload
              [nzShowUploadList]="nzShowUploadList"
              [nzAction]="uploadUrl"
              nzListType="picture-card"
              [(nzFileList)]="fileList"
              (nzChange)="handleChangeFile($event)"
              [nzShowButton]="fileList.length < 1"
              formControlName="imageUrl"
            >
              <div>
                <span nz-icon nzType="plus"></span>
                <div>{{ 'Upload' | translate }}</div>
              </div>
            </nz-upload>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            'CategoryMain' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-category-main-select
              formControlName="categoryMainId"
            ></app-category-main-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{
            'Remark' | translate
          }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input rows="3" formControlName="remark"></textarea>
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
export class CategoryEditComponent implements OnInit {
  readonly modalData: any = inject(NZ_MODAL_DATA);
  autoTips = CommonValidators.autoTips;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Category | null = null;
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  constructor(
    protected modal: NzModalRef<CategoryEditComponent>,
    private fb: FormBuilder,
    private service: CategoryService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControls();
    if (this.modalData.id) {
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Category) => {
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
      remark: [null],
      imageUrl: [null],
      categoryMainId: [0],
    });
  }

  public setFormValue(model: Category) {
    console.log('Original imageUrl:', model.imageUrl);
    const parsedImageUrl = this.parseImageUrl(model.imageUrl);
    console.log('Parsed imageUrl:', parsedImageUrl);
    if (this.frm) {
      this.frm.patchValue({
        name: model.name,
        nameKh: model.nameKh,
        remark: model.remark,
        categoryMainId: model.categoryMainId,
        imageUrl: model.imageUrl ?? null,
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
    }
  }

  public handleChangeFile = (info: NzUploadChangeParam) => {
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
        next: (category: Category) => {
          console.log('Category List:', category);
          this.model = category;
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
