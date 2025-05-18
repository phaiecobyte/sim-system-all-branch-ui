import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../shared/services/common-validators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Branch, BranchService } from "./branch.service";
import { NotificationService } from "../../shared/services/notification.service";


@Component({
  selector:'app-branch-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Add' | translate}}</span>
    </div>
    <div  class="modal-content">
        <nz-spin *ngIf="isLoading" nzSimple style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"></nz-spin>
        <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips" >
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Name' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input formControlName="name"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24">{{'Code' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <input nz-input formControlName="code"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Phone' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <input nz-input formControlName="phone" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" >{{'Tax' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <input nz-input type="checkbox" formControlName="tax" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Address' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <textarea nz-input rows="3" formControlName="address"></textarea>
            </nz-form-control>
          </nz-form-item>
        </form>
    </div>
    <div *nzModalFooter>
        <div nz-flex nzJustify="flex-end" nzGap="small">
          <button nz-button (click)="closeModal()" nzType="default">{{'Cancel' | translate}}</button>
          <button nz-button (click)="onSubmit()" [disabled]="frm.invalid" nzType="primary">{{'Save' | translate}}</button>
        </div>
    </div>
  `,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone:false
})

export class BranchAddComponent implements OnInit{
  constructor(
      protected modal: NzModalRef<BranchAddComponent>,
      private fb:FormBuilder,
      private service:BranchService,
      private notification:NotificationService
    ) {
    }

  autoTips = CommonValidators.autoTips;
  isLoading:boolean=false;
  frm!:FormGroup;
  model:Branch;


  ngOnInit(): void {
    this.initControl();
  }

  initControl():void{
    const{required,singlePhoneValidator,multiplePhoneValidator} = CommonValidators;
    this.frm = this.fb.group({
      code:[null,[required]],
      name:[null,[required]],
      phone:[null,[required,multiplePhoneValidator]],
      address:[null,[required]],
      tax:[0]
    })
  }

  onSubmit(){
    if(this.frm.valid){
      this.isLoading = true;
      this.service.add(this.frm.value).subscribe({
        next:(branch:Branch):void=>{
          console.log("Branch",branch)
          this.model = branch;
          this.notification.showAddSuccess();
        },
        error:(error):void=>{
          this.isLoading = false;
          console.log(error);
        },
        complete:async()=>{
          this.isLoading = false;
          await this.modal.triggerOk();
        }
      })
    }
  }

  closeModal(){
    this.modal.close();
  }
}
