import {Component, OnInit} from '@angular/core';
import {Branch, BranchService} from './branch.service';
import {Subscription} from 'rxjs';
import { BranchUiService } from './branch-ui.service';
import { QueryParam } from '../../shared/services/base-api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGE_SIZE_OPTION } from '../../const';

@Component({
    selector: 'app-branch-list',
    template: `
    <nz-header>
      <div nz-flex nzJustify="space-between" nzAlign="center">
        <div>
            <nz-input-group [nzSuffix]="suffixIconSearch">
              <input type="text" nz-input placeholder="Search" />
            </nz-input-group>
            <ng-template #suffixIconSearch>
              <nz-icon nzType="search"  nzTheme="outline"/>
            </ng-template>
          </div>
          <div>
            <button nz-button nzType="primary"
                    (click)="uiService.showAdd()"
                    >
                <nz-icon nzType="plus" />
                {{'Add'|translate}}
            </button>
          </div>
      </div>
    </nz-header>
    <nz-content>
      <nz-table
        [nzLoading]="isLoading" #smallTable
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
            <th>#</th>
            <th>{{'Code' | translate}}</th>
            <th>{{'Name' | translate}}{{'Branch' | translate}}</th>
            <th>{{'Phone' | translate}}</th>
            <th>{{'Tax' | translate}}</th>
            <th>{{'Address' | translate}}</th>
            <th nzWidth="100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of smallTable.data; let i = index">
          <td>{{ i | rowNumber : {index: param.pageIndex ?? 0 , size: param.pageSize ?? 0} }}</td>
            <td>{{item.code}}</td>
            <td>{{item.name}}</td>
            <td>{{item.phone}}</td>
            <td>{{item.tax}}</td>
            <td>{{item.address}}</td>
            <td>
              <nz-space [nzSplit]="spaceSplit">
                <ng-template #spaceSplit>
                  <nz-divider nzType="vertical"></nz-divider>
                </ng-template>
                <a *nzSpaceItem (click)="uiService.showEdit(item.id)" style="white-space: nowrap;"><nz-icon nzType="edit" /> {{'Edit' | translate}}</a>
                <a *nzSpaceItem style="color: red; white-space:nowrap" (click)="uiService.showDelete(item.id)"><nz-icon nzType="delete" />{{'Delete' | translate}}</a>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-content>
  `,
    styleUrls: ['../../shared/scss/list.style.scss'],
  standalone: false
})

export class BranchListComponent implements  OnInit{

   constructor(
      protected uiService:BranchUiService,
      private service:BranchService
    ){}

    refreshSub: Subscription = new Subscription();

    isLoading:boolean=false;
    list:Branch[]=[];
    searchText:string='';
    param:QueryParam={
      pageIndex:1,
      pageSize:10,
      sorts:'',
      filters:''
    }

    ngOnInit(): void {
      this.onSearch();
      this.refreshSub = this.uiService.refresher.subscribe({
        next:(e:any)=>{
          console.log(e);
          this.onSearch();
        }
      })
    }

    onSearch(){
      this.isLoading = true;
      const filters = [];
      if (this.searchText){
        filters.push({field: 'name', operator: 'contains', value: this.searchText})
      }
      this.param.filters = JSON.stringify(filters);
      this.service.search(this.param).subscribe({
        next: (result: {results: Branch[], param: QueryParam}) => {
          this.list = result.results;
          this.param = result.param;
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error)
        }
      })
    }

    onQueryParamsChange(param: NzTableQueryParams): void {
      const {pageSize, pageIndex, sort} = param;
      const sortFound = sort.find(x => x.value);
      // this.param.sorts = (sortFound?.key ?? this.sortNameInjected) + (sortFound?.value === 'descend' ? '-' : '');
      this.param.pageSize = pageSize;
      this.param.pageIndex = pageIndex;
      // this.sessionStorageService.setPageSizeOptionKey(pageSize, this.pageSizeOptionKey);
      this.onSearch();
    }

    ngOnDestroy(): void {
      if (this.refreshSub){
        this.refreshSub.unsubscribe();
      }
    }


    protected readonly PAGE_SIZE_OPTION = PAGE_SIZE_OPTION;

}
