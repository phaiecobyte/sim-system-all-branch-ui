import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Customer, CustomerService} from './customer.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonValidators } from '../../shared/services/common-validators';

@Component({
  selector: 'app-customer-edit',
  template: `
    <div *nzModalTitle class="modal-header">
      <span>{{ 'Edit' | translate }}{{'Customer' | translate}}</span>
    </div>
    <div class="modal-content">
      <form
        nz-form
        [formGroup]="frm"
        (ngSubmit)="onSubmit()"
        [nzAutoTips]="autoTips"
      >
      <div nz-row>
          <div nz-col nzSpan="11">
            <nz-form-item nzFlex>
              <nz-form-label nzSpan="8">{{
                'Customer Name' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="name" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="11">
            <nz-form-item nzFlex>
              <nz-form-label nzSpan="8">{{
                'Customer Code' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="code" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div nz-row nzAlign="middle">
          <div nz-col nzSpan="11">
            <nz-form-item>
              <nz-form-label nzSpan="8">{{
                'Short Name' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="shortName" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="11">
            <nz-form-item>
              <nz-form-label nzSpan="8">{{
                'Phone' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="phone" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div nz-row nzAlign="middle">
          <div nz-col nzSpan="11">
            <nz-form-item>
              <nz-form-label nzSpan="8">{{
                'Gender' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <app-gender-select formControlName="sex" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="11">
            <nz-form-item>
              <nz-form-label nzSpan="8">{{ 'Type' | translate }}</nz-form-label>
              <nz-form-control nzSpan="16">
                <app-customerType-select formControlName="customerType" />
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div nz-row>
          <div nz-col nzSpan="22">
            <nz-form-item>
              <nz-form-label nzSpan="4">{{
                'Address' | translate
              }}</nz-form-label>
              <nz-form-control nzSpan="20">
                <textarea
                  nz-input
                  rows="3"
                  formControlName="location"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div nz-row>
          <div nz-col nzSpan="22">
            <nz-form-item>
              <nz-form-label nzSpan="4">{{ 'Note' | translate }}</nz-form-label>
              <nz-form-control nzSpan="20">
                <textarea
                  nz-input
                  rows="3"
                  formControlName="description"
                ></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">
          {{ 'Cancel' | translate }}
        </button>
        <button
          nz-button
          (click)="onSubmit()"
          [disabled]="frm.invalid"
          nzType="primary"
        >
          {{ 'Save' | translate }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CustomerEditComponent implements OnInit {
  constructor(
    protected modal: NzModalRef<CustomerEditComponent>,
    private fb: FormBuilder,
    private service: CustomerService,
    private notification: NotificationService
  ) {}

  autoTips = CommonValidators.autoTips;
  isLoading: boolean = false;
  frm!: FormGroup;
  model: Customer = {};

  readonly modalData: any = inject(NZ_MODAL_DATA);

  ngOnInit(): void {
    this.initControls();
    if (this.modalData.id) {
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Customer) => {
          this.model = model;
          this.setFormValue(model);
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  initControls(): void {
    const { required, singlePhoneValidator, multiplePhoneValidator } =
      CommonValidators;
    this.frm = this.fb.group({
      name: [null, [required]],
      shortName: [null],
      sex: [null, [required]],
      phone: [null, [multiplePhoneValidator]],
      customerType: [null],
      location: [null],
      description: [null],
    });
  }

  setFormValue(model: Customer) {
    this.frm.patchValue({
      name: model.name,
      shortName: model.shortName,
      sex: model.sex,
      phone: model.phone,
      customerType: model.customerType,
      location: model.location,
      description: model.description,
    });
  }
  onSubmit() {
    if (this.frm.valid) {
      this.isLoading = true;
      this.service.edit({ ...this.frm.value, id: this.model.id }).subscribe({
        next: (customer: Customer) => {
          console.log('customer', customer);
          this.model = customer;
          this.notification.showEditSuccess();
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        },
      });
    }
  }

  closeModal() {
    this.modal.close();
  }
}
