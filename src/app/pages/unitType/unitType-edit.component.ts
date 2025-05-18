import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { UnitType, UnitTypeService } from './unitType.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonValidators } from '../../shared/services/common-validators';

@Component({
  selector: 'app-unitType-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{'Edit' | translate}} {{model.name}}</span>
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

export class UnitTypeEditComponent implements OnInit {
   constructor(
      protected modal: NzModalRef<UnitTypeEditComponent>,
      private fb: FormBuilder,
      private service:UnitTypeService,
      private alert:NotificationService
    ) {}

    autoTips=CommonValidators.autoTips;
    isLoading:boolean=false;
    frm!:FormGroup;
    model:UnitType= {};

    readonly modalData: any = inject(NZ_MODAL_DATA);

    ngOnInit(): void {
      this.initControls();
      if(this.modalData.id){
        this.isLoading = true;
        this.service.find(this.modalData.id).subscribe({
          next:(model:UnitType):void=>{
            this.model = model;
            console.log("model",model)
            this.setFormValue(model);
            this.isLoading = false;
          },
          error:(error):void=>{
            console.log(error);
          }
        })
      }
    }

    closeModal() {
      this.modal.close();
    }

    initControls() {
      const {required} = CommonValidators
      this.frm = this.fb.group({
        name: [null,[required]],
        nameKh: [null],
        qty: [0],
        unitQty: [0],
      });
    }
    setFormValue(model: UnitType) {
      if (this.frm) {
        this.frm.patchValue({
          name:model.name,
          nameKh:model.nameKh,
          qty:model.qty,
          unitQty:model.unitQty
        });
      }
    }

    onSubmit(){
      if (this.frm.valid){
        this.isLoading = true;
        this.service.edit({...this.frm.value,id: this.model.id}).subscribe({
          next: (unitType: UnitType) => {
            console.log("unitType",unitType)
            this.model = unitType;
            this.alert.showEditSuccess();
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
}
