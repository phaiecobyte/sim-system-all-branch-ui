import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';
import { Branch, BranchService } from './branch.service';

@Component({
  selector: 'app-branch-delete',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Delete' | translate }} {{ model?.name }}</span>
    </div>
    <div class="modal-content">
      <nz-spin *ngIf="isLoading" nzSimple class="loading"></nz-spin>
      <form nz-form [formGroup]="frm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'Code' | translate }}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="code" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="24">{{ 'name'| translate}}</nz-form-label>
          <nz-form-control [nzSm]="14" [nzXs]="24">
            <input nz-input formControlName="name"/>
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
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class BranchDeleteComponent implements OnInit{
  constructor(
    protected modal: NzModalRef<BranchDeleteComponent>,
    private fb: FormBuilder,
    private  service: BranchService,
    private notification:NotificationService
  ) {
  }

  readonly modalData:any = inject(NZ_MODAL_DATA);
  isLoading:boolean = false;
  frm!: FormGroup;
  model: Branch;

  ngOnInit(): void {
    this.initControl();
    if (this.modalData.id){
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Branch) => {
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
      code: [{value:null, disabled: true}],
      name: [{value:null, disabled: true}],
      note: [null],
    })
  }

  onSubmit(){
    if (this.frm.valid){
      this.isLoading = true;
      this.service.delete({...this.frm.value,id: this.model.id}).subscribe({
        next: (branch: Branch) => {
          console.log("Branch",branch)
          this.model = branch;
          this.notification.showDeleteSuccess();
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

  setFormValue(model: Branch){
    this.frm.patchValue({
      name: model.name,
      code: model.code,
    })
  }

  closeModal() {
    this.modal.close();
  }
}
