import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonValidators} from '../../shared/services/common-validators';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {CategoryMain, CategoryMainService} from '../category-main/category-main.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-category-main-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Add'| translate}}{{'Category Main' | translate}}</span>
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
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Short Name'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="shortName"/>
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

export class CategoryMainAddComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<CategoryMainAddComponent>,
    private fb: FormBuilder,
    private  service: CategoryMainService,
    private notification:NotificationService
  ) {
  }

  autoTips = CommonValidators.autoTips;
  isLoading:boolean = false;
  fileList: NzUploadFile[] = []
  categoryMainList: CategoryMain[] = [];
  frm!: FormGroup;
  model: CategoryMain = {};

  ngOnInit(): void {
    this.initControl();
  }

  initControl(){
    const { required} = CommonValidators
    this.frm = this.fb.group({
      name: [null, [required]],
      shortName: [null],
    })
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;

      console.log(this.frm.getRawValue());

      this.service.add(this.frm.value).subscribe({
        next: (categoryMain: CategoryMain) => {
          console.log("CategoryMain",categoryMain)
          this.model = categoryMain;
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
