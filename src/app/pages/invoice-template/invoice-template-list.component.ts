import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { PAGE_SIZE_OPTION } from '../../const';
import { InvoiceTemplateService, Template } from './invoice-template.service';
import { InvoiceTemplateUiService } from './invoice-template-ui.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-template-list',
  template: `
    <app-breadcrumb
      *ngIf="breadcrumbData"
      [data]="breadcrumbData"
    ></app-breadcrumb>
    <nz-header>
      <div nz-flex nzJustify="space-between" nzAlign="center">
        <div>
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input type="text" nz-input placeholder="Search" />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <nz-icon nzType="search" nzTheme="outline" />
          </ng-template>
        </div>
        <div>
          <button nz-button nzType="primary" (click)="uiService.showAdd()">
            <nz-icon nzType="plus" />
            {{ 'Add' | translate }}
          </button>
        </div>
      </div>
    </nz-header>
    <nz-content>
      <nz-table
        [nzLoading]="isLoading"
        [nzData]="list"
        nzSize="small"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of list; let i = index">
            <td>{{i+1}}</td>
            <td>{{item.name}}</td>
            <td>
              <a nz-button nzType="primary" (click)="uiService.showEdit(item.id)" nzSize="default" style="margin-right:5px"> <nz-icon nzType="edit"/> </a>
              <!-- <a nz-button nzDanger (click)="uiService.showDelete(item.id)" nzSize="default"> <nz-icon nzType="delete" /> </a> -->
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-content>
    <app-code-editor
  formControlName="templateHtml"
  language="html"
  theme="vs-dark"
  height="500px">
</app-code-editor>
  `,
  styleUrls: ['../../shared/scss/list.style.scss'],
  standalone: false,
})
export class InvoiceTemplateListComponent implements OnInit {
  constructor(
    protected uiService: InvoiceTemplateUiService,
    private service: InvoiceTemplateService,
    private activated:ActivatedRoute,
  ) {}

  breadcrumbData!: Observable<any>;
  refreshSub: Subscription = new Subscription();
  isLoading: boolean = false;
  list: Template[] = [];
  searchText: string = '';


  ngOnInit(): void {
    this.breadcrumbData = this.activated.data;
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
    this.service.getAll().subscribe((res:any)=>{
      this.isLoading = false;
      this.list = res;
    })
  }


  ngOnDestroy(): void {
    if (this.refreshSub){
      this.refreshSub.unsubscribe();
    }
  }

  protected readonly PAGE_SIZE_OPTION = PAGE_SIZE_OPTION;
}
