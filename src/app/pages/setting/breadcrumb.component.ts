import {Component, Input, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {Data} from  "@angular/router"

@Component({
    selector: 'app-breadcrumb',
    template: `
    <nz-breadcrumb [nzAutoGenerate]="true">
      <nz-breadcrumb-item>
        <a [routerLink]="result[0].url">
          <i nz-icon nzType="arrow-left"  nzTheme="outline"></i>
          <span>{{ result[0].label | translate}}</span>
        </a>
      </nz-breadcrumb-item>
      <nz-breadcrumb-item>{{ result[1].label | translate}}</nz-breadcrumb-item>
    </nz-breadcrumb>
  `,
    styles: [`
    nz-breadcrumb{
      height: 42px;
      line-height: 42px;
      border-bottom:1px solid var(--ant-border-color);
      padding: 0 16px;
      background-color: var(--ant-primary-color-contrast);
    }
  `],
  standalone: false
})

export class BreadcrumbComponent implements OnInit{

  @Input() data!: Observable<Data>;
  result: Data = [];
  ngOnInit(): void {
    this.data.subscribe(result => {
      this.result = result;
    })
  }

}
