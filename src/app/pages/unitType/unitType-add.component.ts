import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NzModalRef } from "ng-zorro-antd/modal";
import { UnitType, UnitTypeService } from "./unitType.service";
import { NotificationService } from "../../shared/services/notification.service";
import { CommonValidators } from "../../shared/services/common-validators";

@Component({
  selector:'app-unitType-add',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Add' | translate}}</span>
    </div>
    <div  class="modal-content">
        <nz-spin *ngIf="isLoading" nzSimple style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);z-index: 9999"></nz-spin>
        <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()" [nzAutoTips]="autoTips" >
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24" [nzRequired] >{{'Name' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input formControlName="name"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24" >{{'NameKh' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input formControlName="nameKh"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item >
            <nz-form-label [nzSm]="6" [nzXs]="24" >{{'Qty' | translate}}</nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input type="number" formControlName="qty"/>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item >
            <nz-form-label [nzSm]="12" [nzXs]="24"> ខ្នាតស័ង្កសី UnitQty * Qty * Price </nz-form-label>
            <nz-form-control  [nzSm]="14"
                              [nzXs]="24"
                              >
              <input nz-input type="checkbox" [checked]="frm.value.unitQty === 1" formControlName="unitQty"/>
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
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class UnitTypeAddComponent implements OnInit{

 constructor(
       protected modal: NzModalRef<UnitTypeAddComponent>,
       private fb:FormBuilder,
       private service:UnitTypeService,
       private alert:NotificationService
     ) {
     }

   autoTips = CommonValidators.autoTips;
   isLoading:boolean=false;
   frm!:FormGroup;
   model:UnitType={};


   ngOnInit(): void {
     this.initControl();
   }

   initControl():void{
     const{required} = CommonValidators;
     this.frm = this.fb.group({
      name:[null,[required]],
      nameKh:[null],
      qty:[0],
      unitQty:[0]
     })
   }

   onSubmit(){
     if(this.frm.valid){
       this.isLoading = true;
       this.service.add(this.frm.value).subscribe({
         next:(unitType:UnitType):void=>{
           console.log("UnitType",unitType)
           this.model = unitType;
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
