import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGE_SIZE_OPTION } from '../../const';
import { QueryParam } from '../../shared/services/base-api.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SaleUiService } from './sale-ui.service';
import { Order, OrderService } from './order.service';

@Component({
  selector: 'app-sale',
  template: `
    <nz-header>
      <div nz-flex nzJustify="space-between" nzAlign="center">
        <div>
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input [(ngModel)]="searchText" (keyup.enter)="onSearch()" type="text" nz-input placeholder="Search Customer Name" />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <nz-icon nzType="search" nzTheme="outline" />
          </ng-template>
        </div>
        <div>
          <button (click)="uiService.showAdd()" nz-button nzType="primary">
            <nz-icon nzType="shop" />
            លក់
          </button>
        </div>
      </div>
    </nz-header>
    <nz-content>
      <nz-table
        nzTitle="តារាងប្រតិបត្តិការលក់"
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
            <th nzColumnKey="date" [nzSortFn]="true">កាលបរិច្ឆេទ</th>
            <th nzColumnKey="customerName" [nzSortFn]="true">អតិថិជន</th>
            <th nzColumnKey="warehouseName" [nzSortFn]="true">ឃ្លាំង</th>
            <th nzColumnKey="paymentMethodName" [nzSortFn]="true">ប្រភេទបង់ប្រាក់</th>
            <th nzColumnKey="discount" [nzSortFn]="true">បញ្ចុះតម្លៃ</th>
            <th nzColumnKey="amount" [nzSortFn]="true">សរុបត្រូវបង់</th>
            <th nzColumnKey="deposit" [nzSortFn]="true">បានបង់</th>
            <th >ជំពាក់</th>
            <th nzWidth="100px"></th>
          </tr>
        </thead>
        <tbody>
          @for (data of list; track data.id; let i = $index) {
            <tr (click)="onRowClick(data.id)">
              <td>{{ i | rowNumber : { index: param.pageIndex ?? 0, size: param.pageSize ?? 0 } }}</td>
              <td>{{ data.date | date }}</td>
              <td>{{ data.customerName }}</td>
              <td>{{ data.warehouseName }}</td>
              <td>{{ data.paymentMethodName }}</td>
              <td>{{ data.discount | number:'1.0-2' }}%</td>
              <td>{{ data.amount | currency }}</td>
              <td>{{ data.deposit | currency }}</td>
              <td>{{ (data.amount - data.deposit) | currency }}</td>
              <td>
                <nz-space [nzSplit]="spaceSplit">
                  <ng-template #spaceSplit>
                    <nz-divider nzType="vertical"></nz-divider>
                  </ng-template>
                  <a *nzSpaceItem (click)="uiService.showPrint(data.id)" style="white-space: nowrap;"
                  ><nz-icon nzType="printer" /> {{ 'print' | translate }}</a
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
  styles: [`
    .cursor-pointer {
      cursor: pointer;
    }
  `],
  standalone: false
})
export class SaleListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  refreshSub: Subscription = new Subscription();
  isLoading: boolean = false;
  list: Order[] = [];
  searchText: string = '';
  param: QueryParam = {
    pageIndex: 1,
    pageSize: 10,
    sorts: '',
    filters: '',
  };

  constructor(
    protected uiService: SaleUiService,
    private service: OrderService,
  ) {}

  ngOnInit(): void {
    this.onSearch();
    this.uiService.refresher.pipe(takeUntil(this.destroy$)).subscribe({
      next: (e: any) => {
        console.log(e);
        this.onSearch();
        console.log('Order List', this.list);
      },
    });
  }

  onRowClick(id: number) {
    // Implement row click functionality if needed
  }

  onSearch(): void {
    this.isLoading = true;
    const filters = [];
    if (this.searchText) {
      filters.push({ field: 'CustomerName', operator: 'contains', value: this.searchText });
    }
    this.param.filters = JSON.stringify(filters);

    this.service.search(this.param).subscribe({
      next: (result: { results: Order[]; param: QueryParam }) => {
        this.list = result.results;
        this.param = result.param;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      },
    });
  }

  onQueryParamsChange(param: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = param;

    // Handle sorting
    const currentSort = sort.find(item => item.value !== null);
    if (currentSort) {
      const sortField = currentSort.key;
      const sortDirection = currentSort.value === 'ascend' ? '+' : '-';
      this.param.sorts = `${sortDirection}${sortField}`;
    } else {
      // Default sort is by Id descending
      this.param.sorts = '-id';
    }

    // Handle pagination
    if (this.param.pageSize !== pageSize || this.param.pageIndex !== pageIndex) {
      this.param.pageSize = pageSize;
      this.param.pageIndex = pageIndex;
    }

    this.onSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly PAGE_SIZE_OPTION = PAGE_SIZE_OPTION;
}


