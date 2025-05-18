import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemUiService } from './product-ui.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGE_SIZE_OPTION } from '../../const';
import { ItemService, Product, ProductUnit } from './product.service';
import { QueryParam } from '../../shared/services/base-api.service';

@Component({
  selector: 'app-item-list',
  template: `
    <nz-header>
      <div nz-flex nzJustify="space-between" nzAlign="center">
        <div>
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input [(ngModel)]="searchText" (keyup.enter)="onSearch()" type="text" nz-input placeholder="Search" />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <nz-icon nzType="search" nzTheme="outline" />
          </ng-template>
        </div>
        <div>
          <button (click)="uiService.showAdd()" nz-button nzType="primary">
            <nz-icon nzType="plus" />
            {{ 'Add' | translate }}
          </button>
        </div>
      </div>
    </nz-header>
    <nz-content>
      <nz-table
        nzTitle="ពត៌មានផលិតផល"
        [nzLoading]="isLoading"
        #smallTable
        [nzPageSizeOptions]="PAGE_SIZE_OPTION"
        nzShowSizeChanger
        nzSize="small"
        [nzData]="list"
        [nzTotal]="param.rowCount || 0"
        [nzPageSize]="param.pageSize || 0"
        [nzPageIndex]="param.pageIndex || 0"
        [nzFrontPagination]="false"
        (nzQueryParams)="onQueryParamsChange($event)"
      >
        <thead>
          <tr>
            <th nzWidth="45px">#</th>
            <th>{{ 'Image' | translate }}</th>
            <th>{{ 'Code' | translate }}{{ 'Product' | translate }}</th>
            <th>{{ 'Barcode' | translate }}</th>
            <th>{{ 'Name' | translate }}{{ 'Product' | translate }}</th>
            <th>{{ 'Qty-in-Stock' | translate }}</th>
            <th>{{ 'OldMeterPerKg' | translate }}</th>
            <th nzWidth="100px"></th>
          </tr>
        </thead>
        <tbody>
          @for (data of list; track $index; let i = $index) {
          <tr (click)="onRowClick(data.id)">
            <td>{{ i | rowNumber : { index: param.pageIndex ?? 0, size: param.pageSize ?? 0 } }}</td>
            <td>
              <img [src]="data.imageUrl" alt="Product Img" width="50px" height="50px" *ngIf="data.imageUrl; else noImage" />
              <ng-template #noImage>
                <div>
                  <span style="color: gray;">No image</span>
                </div>
              </ng-template>
            </td>
            <td>{{ data.code }}</td>
            <td>
              <span *ngIf="data.barcode; else noBarcode">{{ data.barcode }}</span>
              <ng-template #noBarcode>
                <div>
                  <span style="color: gray;">មិនមាន</span>
                </div>
              </ng-template>
            </td>
            <td>{{ data.name }}</td>
            <td>{{ data.qtyOnHand }}</td>
            <td>{{ data.oldMeterPerKg }}</td>
            <td>
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a *nzSpaceItem (click)="uiService.showEdit(data.id)" style="white-space: nowrap;"
                  ><nz-icon nzType="edit" /> {{ 'Edit' | translate }}</a
                >
                <a *nzSpaceItem style="color: red; white-space: nowrap" (click)="uiService.showDelete(data.id)"
                  ><nz-icon nzType="delete" />{{ 'Delete' | translate }}</a
                >
              </nz-space>
            </td>
          </tr>
          }
        </tbody>
      </nz-table>
    </nz-content>
  `,
  styleUrls: ['../../shared/scss/list.style.scss'],
  standalone: false
})
export class ItemListComponent implements OnInit, OnDestroy {
  selectedProduct: Product | null = null;
  private destroy$ = new Subject<void>();

  refreshSub: Subscription = new Subscription();
  isLoading: boolean = false;
  list: Product[] = [];
  productUnits:ProductUnit[];
  searchText: string = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    sorts: '',
    filters: '',
  };
  constructor(
    protected uiService: ItemUiService,
    private service: ItemService,
  ) {}

  ngOnInit(): void {
    this.onSearch();
    this.uiService.refresher.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e: any) => {
        console.log(e);
        this.onSearch();
        console.log('Product List', this.list);
      },
    });
  }

  onRowClick(id:number){

  }
  onSearch(): void {
    this.isLoading = true;
    const filters = [];
    if (this.searchText) {
      filters.push({ field: 'name', operator: 'contains', value: this.searchText });
    }
    this.param.filters = JSON.stringify(filters);

    this.service.search(this.param).subscribe({
      next: (result: { results: Product[]; param: QueryParam }) => {
        this.list = result.results;
        this.param = result.param;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      },
    });
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex } = param;
    if (this.param.pageSize !== pageSize || this.param.pageIndex !== pageIndex) {
      this.param.pageSize = pageSize;
      this.param.pageIndex = pageIndex;
      this.onSearch();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly PAGE_SIZE_OPTION = PAGE_SIZE_OPTION;
}
