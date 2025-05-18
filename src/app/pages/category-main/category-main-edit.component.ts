import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonValidators} from '../../shared/services/common-validators';
import {NzUploadChangeParam, NzUploadFile} from 'ng-zorro-antd/upload';
import {CategoryMain, CategoryMainService} from '../category-main/category-main.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-category-main-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Edit'| translate}} {{model.name}}</span>
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

export class CategoryMainEditComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<CategoryMainEditComponent>,
    private fb: FormBuilder,
    private  service: CategoryMainService,
    private notification:NotificationService
  ) {
  }

  readonly modalData:any = inject(NZ_MODAL_DATA)
  autoTips = CommonValidators.autoTips;
  isLoading:boolean = false;
  frm!: FormGroup;
  model: CategoryMain = {};

  ngOnInit(): void {
    this.initControl();

    if(this.modalData.id){
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next:(model:CategoryMain)=>{
          this.model = model;
          this.setFormValue(model);
          this.isLoading = false;
        },
        error:(error)=>{
          console.log(error)
        }
      })
    }
  }

  initControl(){
    const { required} = CommonValidators
    this.frm = this.fb.group({
      name: [null, [required]],
      shortName: [null],
    })
  }

  setFormValue(model:CategoryMain){
    this.frm.patchValue({
      name:model.name,
      shortName:model.shortName
    })
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;

      console.log(this.frm.getRawValue());

      this.service.edit({...this.frm.value,id:this.model.id}).subscribe({
        next: (categoryMain: CategoryMain) => {
          console.log("CategoryMain",categoryMain)
          this.model = categoryMain;
          this.notification.showEditSuccess();
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
