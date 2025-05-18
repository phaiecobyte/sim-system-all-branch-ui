import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Brand, BrandService } from './brand.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-brand-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Add' | translate }}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="isLoading" nzSimple class="loading-spinner"></nz-spin>

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
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'NameKh' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="nameKh" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Image' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
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
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>

    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">{{ 'Cancel' | translate }}</button>
        <button nz-button (click)="onSubmit()" [disabled]="frm.invalid" nzType="primary">
          {{ 'Save' | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone:false
})
export class BrandEditComponent implements OnInit {
  readonly modalData: any = inject(NZ_MODAL_DATA);

  autoTips = CommonValidators.autoTips;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Brand | null = null;
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;

  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  constructor(
    protected modal: NzModalRef<BrandEditComponent>,
    private fb: FormBuilder,
    private service: BrandService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.modalData.id) {
      this.loadBrand(this.modalData.id);
    }
  }

  private initForm(): void {
    this.frm = this.fb.group({
      name: [null, [CommonValidators.required]],
      shortName: [null],
      nameKh: [null],
      imageUrl: [null],
    });
  }

  private loadBrand(id: number): void {
    this.isLoading = true;
    this.service.find(id).subscribe({
      next: (brand: Brand) => {
        this.model = brand;
        this.frm.patchValue({
          name: brand.name,
          shortName: brand.shortName,
          nameKh: brand.nameKh,
          imageUrl: brand.imageUrl ?? null,
        });

        // If the brand has an image, populate the upload file list
        if (brand.imageUrl) {
          this.fileList = [
            {
              uid: '-1',
              name: 'Brand Image',
              status: 'done',
              url: brand.imageUrl,
            },
          ];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  handleUploadFiles(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    // Limit number of uploaded files to 1
    fileList = fileList.slice(-1);

    // Update file list and form control value
    this.fileList = fileList.map((file) => {
      if (file.response?.url) {
        file.url = file.response.url;
        file.name = file.response.name || file.name;
      }
      return file;
    });

    this.frm.get('imageUrl')?.patchValue(this.fileList[0]?.url || null);
  }

  onSubmit(): void {
    if (this.frm.invalid) return;

    this.isLoading = true;

    this.service.edit({ ...this.frm.value, id: this.model?.id }).subscribe({
      next: (brand: Brand) => {
        this.model = brand;
        this.notification.showEditSuccess();
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.isLoading = false;
        this.modal.close();
      },
    });
  }

  closeModal(): void {
    this.modal.close();
  }
}
