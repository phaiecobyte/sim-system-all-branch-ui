import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService, Product, ProductUnit } from './product.service';
import { ModalOptions, NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonValidators } from '../../shared/services/common-validators';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-item-edit',
  template: `
    <form nz-form [formGroup]="frm">
    <nz-tabset>
      <nz-tab [nzTitle]="'ពត៌មានផលិតផល'" [nzDisabled]="">

          <div nz-row nzGutter="16">
            <div nz-col nzSpan="12">
              <nz-form-item>
                <nz-form-label nzFor="" nzSpan="24">ផ្នែក</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-category-main-select formControlName="companyId"/>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="8">
              <nz-form-item nzFlex>
                <nz-form-label nzFor="" nzSpan="24">បារកូដ</nz-form-label>
                <nz-form-control nzSpan="24">
                  <input type="text" nz-input formControlName="barcode" />
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
                      (nzChange)="handleChangeFile($event)"
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
                <nz-form-label nzRequired nzFor="" nzSpan="24">ឈ្មោះទំនិញ</nz-form-label>
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
                <nz-form-label nzFor="" nzSpan="24">{{
                  'Category' | translate
                }}</nz-form-label>
                <nz-form-control nzSpan="24">
                  <app-category-select formControlName="categoryId" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col nzSpan="12">
              <nz-form-item nzFlex>
                <nz-form-label nzRequired nzFor="specification" nzSpan="24"
                  >ឈ្មោះបង្ហាញលើបុង</nz-form-label
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
                <nz-form-label nzFor="" nzSpan="24"
                  >សរុបចំនួនគីឡូ</nz-form-label
                >
                <nz-form-control nzSpan="24">
                  <input nz-input placeholder="" formControlName="oldMeterPerKg"/>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
      </nz-tab>

      <nz-tab [nzTitle]="'ខ្នាតលក់'" >
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
                <input type="text" formControlName="name" nz-input />
              </td>
              <td>
                <input  formControlName="cost"  nz-input />
              </td>
              <td>
                <input formControlName="price" nz-input />
              </td>
              <td>
                <label formControlName="typeDefault" nz-checkbox></label>
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
export class ItemEditComponent {
  readonly modalData: any = inject(NZ_MODAL_DATA);
  autoTips = CommonValidators.autoTips;
  isLoading = false;
  fileList: NzUploadFile[] = [];
  frm!: FormGroup;
  model: Product | null = null;
  uploadUrl = `http://34.126.152.101:6061/api/upload/file`;
  nzShowUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    showDownloadIcon: false,
  };
  productUnits: ProductUnit[] = [];

  constructor(
    protected modal: NzModalRef<ItemEditComponent>,
    private fb: FormBuilder,
    private service: ItemService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initControl();
    if (this.modalData.id) {
      this.isLoading = true;
      this.service.find(this.modalData.id).subscribe({
        next: (model: Product) => {
          this.model = model;
          this.setFormValue(model);
          this.isLoading = false;
          console.log("form data",this.frm.value);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false;
        },
      });
    }
  }

  initControl() {
    const { required, decimalValidator } = CommonValidators;
    this.frm = this.fb.group({
      barcode: [null],
      code: [null],
      name: [null,[required]],
      qtyOnHand: [null],
      batchNo: [null],
      categoryId: [0],
      supplierId: [0],
      companyId: [0],
      brandId: [0],
      qtyAlert: [0],
      dayAlert: [0],
      un: [0],
      specification: [null,[required]],
      imageUrl: [null],
      stockType: [null],
      startBalance: [0],
      warehouseId: [0],
      oldMeterPerKg: [0],
      productUnits: this.fb.array([
        this.fb.group({
          id: [0],
          name:[null],
          productId: [0],
          unitTypeId: [0],
          cost: [0],
          price: [0],
          typeDefault: [true],
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
        name:[item?.name?? ''],
        unitTypeId: [item?.unitTypeId ?? 0],
        cost: [item?.cost ?? 0],
        price: [item?.price ?? 0],
        typeDefault: [item?.typeDefault ?? 0],
        costOld: [item?.costOld ?? 0],
        qtyOld: [item?.qtyOld ?? 0],
      });
      this.productUnitFrom.push(productUnit);
    }

    deleteProductUnit(index: number) {
      this.productUnitFrom.removeAt(index);
    }

  public setFormValue(model: Product) {
    const parsedImageUrl = this.parseImageUrl(model.imageUrl);
    if (this.frm) {
      this.frm.patchValue({
        barcode: model.barcode,
        code: model.code,
        name: model.name,
        qtyOnHand: model.qtyOnHand,
        batchNo: model.batchNo,
        categoryId: model.categoryId,
        supplierId: model.supplierId,
        companyId: model.companyId,
        brandId: model.brandId,
        qtyAlert: model.qtyAlert,
        dayAlert: model.dayAlert,
        un: model.un,
        specification: model.specification,
        stockType: model.stockType,
        startBalance: model.startBalance,
        warehouseId: model.warehouseId,
        oldMeterPerKg: model.oldMeterPerKg,
        imageUrl: model.imageUrl ?? null,
      });
      if (parsedImageUrl) {
        this.fileList = [
          {
            uid: '-1',
            name: 'Uploaded Image',
            status: 'done',
            url: parsedImageUrl,
          },
        ];
      }
      if(model.productUnits){
        this.productUnitFrom?.clear();
        console.log(model.productUnits)
        model.productUnits?.forEach(proUnit => {
          this.addProductUnit(proUnit);
        })
      }
    }
  }

  public handleChangeFile = (info: NzUploadChangeParam) => {
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
    this.frm.get('imageUrl').patchValue(fileList[0]?.url);
    this.fileList = fileList;
  };

  public parseImageUrl(imageUrl: string | null): string | undefined {
    if (!imageUrl) return undefined;

    try {
      const parsed = JSON.parse(imageUrl);
      return parsed?.url || imageUrl;
    } catch {
      return imageUrl;
    }
  }

  public onSubmit = () => {
    if (this.frm.valid) {
      const payload = {
        ...this.frm.value,
        id: this.model?.id,
      };

      if (!payload.imageUrl) {
        payload.imageUrl = null;
      }

      this.service.edit(payload).subscribe({
        next: (product: Product) => {
          this.model = product;
          this.notification.showEditSuccess();
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        },
      });
    }
  };

  public closeModal = () => {
    this.modal.close();
  };

  public editUnit(unit: any) {
    // Implement edit logic
  }

  public removeUnit(unit: any) {
    // Implement remove logic
  }
}
