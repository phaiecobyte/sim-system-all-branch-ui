import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../shared/services/common-validators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NotificationService } from "../../shared/services/notification.service";
import { Shipper, ShipperService } from "./shipper.service";

@Component({
  selector:'app-shipper-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Add' | translate}}{{"Shipper" | translate}}</span>
    </div>
    <div  class="modal-content">
        <nz-spin *ngIf="isLoading" nzSimple style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"></nz-spin>
        <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips" >
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Name/Company' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input formControlName="name"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24">{{'Contact Name' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <input nz-input formControlName="contactName"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{'Contact Phone' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24">
              <input nz-input formControlName="contactPhone" />
            </nz-form-control>
          </nz-form-item>
          <div nz-row>
            <div nz-col nzSpan="12">
              <nz-form-item>
                <nz-form-label [nzSm]="12" [nzXs]="24">{{'Gender' | translate}}</nz-form-label>
                <nz-form-control  [nzSm]="12"
                                  [nzXs]="24">
                  <app-gender-select formControlName="sex"/>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="12">
              <nz-form-item>
                <nz-form-label [nzSm]="4" [nzXs]="24">{{'Warehouse' | translate}}</nz-form-label>
                <nz-form-control  [nzSm]="12"
                                  [nzXs]="24">
                  <app-branch-select formControlName="warehouseId"/>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
          <nz-form-item>
            <nz-form-label [nzSm]="6" [nzXs]="24">{{'Address' | translate}}</nz-form-label>
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

export class ShipperAddComponent implements OnInit{
  constructor(
      protected modal: NzModalRef<ShipperAddComponent>,
      private fb:FormBuilder,
      private service:ShipperService,
      private alert:NotificationService
    ) {
    }

  autoTips = CommonValidators.autoTips;
  isLoading:boolean=false;
  frm!:FormGroup;
  model:Shipper={};


  ngOnInit(): void {
    this.initControl();
  }

  initControl():void{
    const{required,multiplePhoneValidator} = CommonValidators;
    this.frm = this.fb.group({
      warehouseId:[1],
      name:[null,[required]],
      sex:[null],
      contactName:[null],
      contactPhone:[null,[required,multiplePhoneValidator]],
      address:[null],
    })
  }

  onSubmit(){
    if(this.frm.valid){
      this.isLoading = true;
      this.service.add(this.frm.value).subscribe({
        next:(shipper:Shipper):void=>{
          console.log("Shipper",shipper)
          this.model = shipper;
          this.alert.showAddSuccess();
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
