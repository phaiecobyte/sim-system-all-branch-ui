import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { Vendor, VendorService } from "./vendor.service";
import { NotificationService } from "../../shared/services/notification.service";

@Component({
  selector:'app-vendor-delete',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Delete' | translate }} {{ model?.supplierName }}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="isLoading" nzSimple class="loading"></nz-spin>
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Name/Company/Guest' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="supplierName" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'ContactPhone'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="contactPhone"/>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Note' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <textarea nz-input rows="3"
                      formControlName="note"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">Cancel</button>
        <button nz-button (click)="onSubmit()" [disabled]="!frm.valid || isLoading"
                type="submit" nzType="primary" nzDanger >{{ 'Delete'  | translate}}</button>
      </div>
    </div>
  `,
  styleUrls:[],
  standalone:false
})
export class VendorDeleteComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<VendorDeleteComponent>,
    private fb: FormBuilder,
    private  service: VendorService,
    private alert:NotificationService,
  ) {
  }

  readonly modalData:any = inject(NZ_MODAL_DATA);
  isLoading:boolean = false;
  frm!: FormGroup;
  model: Vendor = {};

  ngOnInit(): void {
    this.initControl();
    if (this.modalData.id){
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Vendor) => {
          this.model = model;
          this.setFormValue(model);
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  initControl(){
    this.frm = this.fb.group({
      supplierName: [{value:null, disabled: true}],
      contactPhone: [{value:null, disabled: true}],
      note: [null],
    })
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;
      this.service.delete({...this.frm.value,id: this.model.id}).subscribe({
        next: (vendor: Vendor) => {
          console.log("vendor",vendor)
          this.model = vendor;
          this.alert.showDeleteSuccess();
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

  setFormValue(model: Vendor){
    this.frm.patchValue({
      supplierName: model.supplierName,
      contactPhone: model.contactPhone,
    })
  }

  closeModal() {
    this.modal.close();
  }
}
