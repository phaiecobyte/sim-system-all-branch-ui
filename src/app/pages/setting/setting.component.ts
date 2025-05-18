import { Component, OnInit } from '@angular/core';

interface SubName {
  icon?: string;
  url?: string;
  label: string;
  isList?: boolean;
}

interface Setting {
  groupName: string;
  subName: SubName[];
}

@Component({
    selector: 'app-setting',
    template: `
    <nz-layout>
      <nz-header>
        <div nz-row>
          <div nz-col [nzSm]="24">
            <i nzType="setting" nz-icon nzTheme="outline"></i>
            <span>{{ 'Setting'  }}</span>
          </div>
        </div>
      </nz-header>
      <nz-spin class="loading half-loading" *ngIf="isLoading"></nz-spin>
      <nz-content>
        <div nz-row>
          <ng-container *ngFor="let data of setting">
          <div nz-col [nzXs]="6" *ngIf="isListGroup(data)">
            <div class="content-header" >
              <p nz-typography>{{ data.groupName  }}</p>
            </div>
            <ng-container *ngFor="let subData of data.subName">
              <div class="content-body" *ngIf="subData.isList">
                <a
                  [routerLink]=" subData.url"
                >
                  <i nzType="{{ subData.icon }}" nz-icon nzTheme="outline"></i>
                  <span>{{ subData.label  }}</span>
                </a>
              </div>
            </ng-container>
          </div>
          </ng-container>

        </div>
      </nz-content>
    </nz-layout>
  `,
    styleUrls: ['../../shared/scss/setting.style.scss'],
  standalone: false
})
export class SettingComponent implements OnInit {
  constructor() { }
  isLoading: boolean = false;
  setting: Setting[] = [];
  urlPart = '/setting';

  ngOnInit(): void {
    this.isLoading = true;
    this.setting = [
      {
        groupName: 'GeneralSetting',
        subName: [
          {
            icon: 'container',
            url: `${this.urlPart}/invoice-template`,
            label: 'Invoice Template',
            isList: true,
          },
        ],
      },
    ];
    setTimeout(() => {
      this.isLoading = false;
    },200);
  }

  isListGroup(data: any): boolean {
    return (
      data.subName?.filter((item: { isList: any }) => item.isList).length > 0
    );
  }
}
