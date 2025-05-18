import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {ItemService, Product, ProductUnit} from './product.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {
  CategoryMain,
  CategoryMainService,
} from '../category-main/category-main.service';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-item-add',
  template: `
    <form nz-form [formGroup]="frm">
    <nz-tabset>
      <nz-tab [nzTitle]="'ពត៌មានផលិតផល'" [nzDisabled]="">
          <div nz-row nzGutter="16">
            <div nz-col nzSpan="12">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">ផ្នែក</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-company-select formControlName="companyId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="8">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24">បារកូដ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input type="text" nz-input formControlName="barcode"/>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="4">
              <nz-form-item nzFlex>
                <nz-form-control nzSpan="24">
                  <div class="photo">
                    <nz-upload
                      [nzShowUploadList]="nzShowUploadList"
                      [nzAction]="uploadUrl"
                      nzListType="picture-card"
                      [(nzFileList)]="fileList"
                      (nzChange)="handleUploadFiles($event)"
                      [nzShowButton]="fileList.length < 1"
                    >
                      <div>
                        <span nz-icon nzType="plus"></span>
                        <div>{{ 'Upload' | translate }}</div>
                      </div>
                    </nz-upload>
                  </div>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <div nz-row nzGutter="16">
            <div nz-col nzSpan="12">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">{{
                  'Vendor' | translate
                }}</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-vendor-select formControlName="supplierId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="12">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24">កូដទំនិញ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input type="text" nz-input formControlName="code" />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <div nz-row nzGutter="16">
            <div nz-col nzSpan="6">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">{{
                  'Warehouse' | translate
                }}</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-branch-select formControlName="warehouseId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="6">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24">{{
                  'Brand' | translate
                }}</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-brand-select formControlName="brandId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="12">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24" nzRequired>ឈ្មោះទំនិញ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input
                    nz-input
                    formControlName="name"
                    id="name"
                    name="name"
                    placeholder=""
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <div nz-row nzGutter="16">
            <div nz-col nzSpan="6">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">ប្រភេទស្តុក</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-stock-type-select formControlName="stockType" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="6">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24" nzRequired>{{
                  'Category' | translate
                }}</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-category-select formControlName="categoryId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="12">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="specification" nzSpan="24"
                  nzRequired>ឈ្មោះបង្ហាញលើបុង</nz-form-label
                >
                <nz-form-control nzSpan="24">
                  <input
                    nz-input
                    formControlName="specification"
                    id="specification"
                    placeholder=""
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <div nz-row nzGutter="16">
            <div nz-col nzSpan="6">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">ស្តុកក្នងដៃ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input
                    nz-input
                    formControlName="qtyOnHand"
                    id="qtyOnHand"
                    placeholder=""
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="6">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="qtyAlert" nzSpan="24"
                  >ចំនួនជិតអស់</nz-form-label
                >
                <nz-form-control nzSpan="24">
                  <input
                    nz-input
                    formControlName="qtyAlert"
                    id="qtyAlert"
                    placeholder=""
                  />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="6">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24">១ម៉ែត=?គីឡូ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input nz-input formControlName="un" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="6">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24" >
                  សរុបចំនួនគីឡូ</nz-form-label
                >
                <nz-form-control nzSpan="24">
                  <input nz-input placeholder="" formControlName="oldMeterPerKg"/>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
      </nz-tab>

      <nz-tab [nzTitle]="'ខ្នាតលក់'" [nzDisabled]="">
        <nz-table #nzTable [nzData]="productUnitFrom.controls" nzNoResult="null">
          <thead>
            <tr>
              <th nzWidth="200px">ប្រភេទខ្នាត</th>
              <th>ខ្នាតទំនិញ</th>
              <th>តម្លៃដើម $</th>
              <th>តម្លៃលក់ $</th>
              <th>ទូទៅ</th>
              <th></th>
            </tr>
          </thead>
          <tbody formArrayName="productUnits">
            <ng-container  *ngFor="let unit of productUnitFrom.controls; let i = index">
            <tr [formGroupName]="i">
              <td>
                 <app-unitType-select formControlName="unitTypeId"/>
              </td>
              <td>
                <input formControlName="name" nz-input />
              </td>
              <td>
                <input  formControlName="cost" nz-input />
              </td>
              <td>
                <input formControlName="price" nz-input />
              </td>
              <td>
                <label formControlName="typeDefault" nz-checkbox nzChecked></label>
              </td>
              <td>
                <a (click)="deleteProductUnit(i)">Remove</a>
              </td>
            </tr>
            </ng-container>
            <tr>
              <td colspan="5">
                <button nz-button nzBlock nzType="dashed" (click)="addProductUnit()">Add</button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-tab>
    </nz-tabset>
    </form>
    <div *nzModalFooter>
      <div nz-flex nzJustify="flex-end" nzGap="small">
        <button nz-button (click)="closeModal()" nzType="default">
          {{ 'Cancel' | translate }}
        </button>
        <button
          nz-button
          (click)="onSubmit()"
          [disabled]="!frm.valid"
          type="submit"
          nzType="primary"
        >
          {{ 'Save' | translate }}
        </button>
      </div>
    </div>
  `,
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
})
export class ItemAddComponent implements OnInit {

  constructor(
    protected modal: NzModalRef<ItemAddComponent>,
    private fb: FormBuilder,
    private service: ItemService,
    private notification: NotificationService
  ) {}

  autoTips = CommonValidators.autoTips;
  isLoading: boolean = false;
  fileList: NzUploadFile[] = [];
  categoryMainList: CategoryMain[] = [];
  frm!: FormGroup;
  model: Product;

  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };

  ngOnInit(): void {
    this.initControl();
  }

  initControl() {
    const { required, decimalValidator } = CommonValidators;
    this.frm = this.fb.group({
      barcode: [null],
      code: [null],
      name: [null],
      qtyOnHand: [0],
      batchNo: [null],
      categoryId: [0,[required]],
      supplierId: [1],
      companyId: [1],
      brandId: [1],
      qtyAlert: [0],
      dayAlert: [0],
      un: [0],
      specification: [null,[required]],
      imageUrl: [null],
      stockType: ['Cut Stock'],
      startBalance: [0],
      warehouseId: [1],
      oldMeterPerKg: [0],
      productUnits: this.fb.array([
        this.fb.group({
          id: [0],
          name: [null],
          productId: [0],
          unitTypeId: [0],
          cost: [0],
          price: [0],
          typeDefault: [0],
          costOld: [0],
          qtyOld: [0],
        })
      ])
    });
  }

  get productUnitFrom(){
    return this.frm.get('productUnits') as FormArray;
  }

  addProductUnit(item?: ProductUnit) {
    let productUnit = this.fb.group({
      id: [item?.id ?? 0],
      productId: [item?.productId ?? 0],
      name: [item?.name?? null],
      unitTypeId: [item?.unitTypeId ?? 0],
      cost: [item?.cost ?? 0],
      price: [item?.price ?? 0],
      typeDefault: [item?.typeDefault ?? true],
      costOld: [item?.costOld ?? 0],
      qtyOld: [item?.qtyOld ?? 0],
    });
    this.productUnitFrom.push(productUnit);
  }

  deleteProductUnit(index: number) {
    this.productUnitFrom.removeAt(index);
  }


  handleUploadFiles(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-10);
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        if (file.response.name) {
          file.name = file.response.name;
        }
      }
      return file;
    });
    console.log('Upload file list: ', fileList);
    this.frm.get('imageUrl').patchValue(fileList[0]?.url);
    this.fileList = fileList;
  }

  parseImageUrl(imageUrl: string): string | undefined {
    try {
      return JSON.parse(imageUrl)?.url;
    } catch {
      return imageUrl;
    }
  }

  onSubmit() {
    if (this.frm.valid) {
      this.isLoading = true;
      console.log(this.frm.getRawValue());
      console.log(this.frm.getRawValue());
      this.service.add(this.frm.value).subscribe({
        next: (product: Product) => {
          console.log('Product', product);
          this.model = product;
          this.notification.showAddSuccess();
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
