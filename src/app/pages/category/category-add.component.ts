import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Category, CategoryService} from './category.service';
import {CommonValidators} from '../../shared/services/common-validators';
import {NzUploadChangeParam, NzUploadFile} from 'ng-zorro-antd/upload';
import {CategoryMain, CategoryMainService} from '../category-main/category-main.service';

@Component({
  selector: 'app-category-add',
  template: `
    <div *nzModalTitle class="modal-header">
    <span>{{'Add' | translate}}{{'Category' | translate}}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="isLoading" nzSimple style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"></nz-spin>
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips">
      <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ 'NameKh'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="nameKh"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Name' | translate }}{{'English' | translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name" />
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
              >
                <div>
                  <span nz-icon nzType="plus"></span>
                  <div>{{ 'Upload' | translate }}</div>
                </div>
              </nz-upload>
            </div>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'CategoryMain' | translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <app-category-main-select formControlName="categoryMainId"></app-category-main-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Remark' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input rows="3"
                      formControlName="remark"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">Cancel</button>
        <button nz-button (click)="onSubmit()" [disabled]="!frm.valid" type="submit" nzType="primary">Save</button>
      </div>
    </div>
  `,
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CategoryAddComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<CategoryAddComponent>,
    private fb: FormBuilder,
    private  service: CategoryService,
  ) {
  }

  autoTips = CommonValidators.autoTips;
  isLoading:boolean = false;
  fileList: NzUploadFile[] = []
  categoryMainList: CategoryMain[] = [];
  frm!: FormGroup;
  model: Category = {};
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
      name: [null],
      nameKh: [null, [required]],
      remark: [null],
      imageUrl: [null],
      categoryMainId: [1],
      printerId: [1],
    })
  }

  handleUploadFiles(info: NzUploadChangeParam): void {
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
        next: (category: Category) => {
          console.log("Category",category)
          this.model = category;
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
