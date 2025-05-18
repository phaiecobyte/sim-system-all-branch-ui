import { Component, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Vendor, VendorService } from "./vendor.service";
import { NzModalRef, NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { CommonValidators } from "../../shared/services/common-validators";
import { NotificationService } from "../../shared/services/notification.service";

@Component({
  selector:'app-vendor-edit',
  template: `
  <div *nzModalTitle class="modal-header">
  <span>{{'Edit' | translate }} {{model.supplierName}} </span>
  </div>
  <div  class="modal-content">
  <nz-spin *ngIf="isLoading" nzSimple class="loading"></nz-spin>
  <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
  <nz-form-item>
    <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ 'Name' | translate }}</nz-form-label>
    <nz-form-control [nzSm]="14" [nzXs]="24">
      <input nz-input formControlName="supplierName" />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Contact Name' | translate }}</nz-form-label>
    <nz-form-control [nzSm]="14" [nzXs]="24">
      <input nz-input formControlName="contactName" />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ 'Contact Phone' | translate }}</nz-form-label>
    <nz-form-control [nzSm]="14" [nzXs]="24">
      <input nz-input formControlName="contactPhone" />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
      <nz-form-label [nzSm]="6" [nzXs]="24">{{'Gender' | translate}}</nz-form-label>
      <nz-form-control  [nzSm]="14"
                        [nzXs]="24">
        <app-gender-select formControlName="sex"/>
      </nz-form-control>
    </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired>{{ 'Address' | translate }}</nz-form-label>
    <nz-form-control [nzSm]="14" [nzXs]="24">
      <textarea nz-input rows="3" formControlName="address"></textarea>
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Description' | translate }}</nz-form-label>
    <nz-form-control [nzSm]="14" [nzXs]="24">
      <textarea nz-input rows="3" formControlName="description"></textarea>
    </nz-form-control>
  </nz-form-item>
</form>

  </div>
  <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">{{'Cancel' | translate}}</button>
        <button nz-button (click)="onSubmit()" [disabled]="!frm.valid || isLoading" nzType="primary">{{'Save' | translate}}</button>
      </div>
  </div>
`,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation:ViewEncapsulation.None,
  standalone:false
})

export class VendorEditComponent implements OnInit{

  constructor(
    protected modal: NzModalRef<VendorEditComponent>,
    private fb: FormBuilder,
    private service:VendorService,
    private alert:NotificationService
  ) {}

  autoTips=CommonValidators.autoTips;
  isLoading:boolean=false;
  frm!:FormGroup;
  model: Vendor = {};

  readonly modalData: any = inject(NZ_MODAL_DATA);

  ngOnInit(): void {
    this.initControls();
    if(this.modalData.id){
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next:(model:Vendor):void=>{
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
    const {required,multiplePhoneValidator,singlePhoneValidator} = CommonValidators
    this.frm = this.fb.group({
      supplierName: [null,[required]],
      contactName: [null],
      contactPhone: [null,[required,multiplePhoneValidator]],
      sex: [null],
      address: [null,[required]],
      description: [null],
      warehouseId: [0],
    });
  }
  setFormValue(model: Vendor) {
    if (this.frm) {
      this.frm.patchValue({
        supplierName: model.supplierName,
        contactName: model.contactName,
        contactPhone: model.contactPhone,
        sex: model.sex,
        address: model.address,
        description: model.description,
        warehouseId: model.warehouseId,
      });
    }
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;
      this.service.edit({...this.frm.value,id: this.model.id}).subscribe({
        next: (vendor: Vendor) => {
          console.log("vendor",vendor)
          this.model = vendor;
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
