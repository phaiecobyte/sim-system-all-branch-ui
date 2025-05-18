import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { OrderService } from "./order.service";

@Component({
  selector: 'app-customer-contract-print',
  template: `
    <div class="page-content" style="padding: 0; height: 100%">
      <div *nzModalTitle class="modal-header-ellipsis">
        <span *ngIf="!this.modalData?.id"> {{ 'Invoice'|translate}}</span>
      </div>
      <nz-content [ngStyle]="{backgroundColor:'#f0f2f5'}" style="height: 100%">
        <app-indeterminate-bar *ngIf="loading"></app-indeterminate-bar>
        <iframe *ngIf="publicUrl" [src]="publicUrl | safe" style="width: 100%;height:100%;border:none"
                id="myIframe"></iframe>
      </nz-content>
      <div *nzModalFooter>
        <a nz-typography (click)="onPrint()">
          <i nz-icon nzTheme="outline" nzType="printer"></i>
          <span class="action-text"> {{ "Print" | translate }}</span>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a href="{{ this.publicUrl }}" target="_blank">
          <i nz-icon nzTheme="outline" nzType="cloud-upload"></i>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a (click)="copyText()" [ngStyle]="{color: isCopy? '#52c41a' : ''}">
          <i nz-icon [nzType]="isCopy ? 'check' : 'copy'" nzTheme="outline"></i>
        </a>
        <nz-divider nzType="vertical"></nz-divider>
        <a nz-button style="border: none; background: none; box-shadow: none; padding: 0"
           (click)="modalRef.triggerCancel()">
          <i nz-icon nzType="close" nzTheme="outline"></i>
          <span class="action-text"> {{ "Close" | translate }}</span>
        </a>
      </div>
    </div>
  `,
  standalone:false
})

export class InvoicePrintComponent implements OnInit, OnDestroy{
  constructor(
    private service: OrderService,
    private httpClient: HttpClient,
    public modalRef: NzModalRef<InvoicePrintComponent>,
    private sanitizer: DomSanitizer
  ) {
  }
  safeHtmlContent: SafeHtml | any = '';
  readonly modalData = inject(NZ_MODAL_DATA);
  publicUrl: any;
  loading!: boolean;
  isCopy: boolean = false;
  refreshSub$: any;

  ngOnInit(): void {

    this.httpClient.get('./templates/invoice-template.html', { responseType: 'text' }).subscribe({
      next: (data) => {
        (this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data))
        this.search(this.modalData.id);
      },
      error: (error) => {
        console.error('Error loading HTML file:', error)
      }
    });
  }


  search(id:number) {
    if (!this.loading) {
      this.loading = true;
      this.publicUrl = "";

      let temUrl = this.service.getPublicViewUrl(id);
      console.log(temUrl)
      this.service.checkUrlValidity(temUrl).subscribe({
        next: () => {
          this.loading = false;
          this.publicUrl = temUrl;
        },
        error: () => {
          this.publicUrl = temUrl;
          this.loading = false;
        }
      })
    }
  }

  copyText() {
    navigator.clipboard.writeText(this.publicUrl).then();
    this.isCopy = true;
    setTimeout(() => {
      this.isCopy = false;
    }, 500);
  }


  triggerDownload(fileData: any): void{
    const dataType = fileData.type;
    const binaryData = [];
    binaryData.push(fileData);
    console.log(binaryData);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    if (this.modalData.model.contractNo) {
      downloadLink.setAttribute('download', this.modalData.model.contractNo);
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  onPrint() {
    const myFrame: any = document.getElementById('myIframe');
    if (myFrame) {
      myFrame['contentWindow'].postMessage('print', '*');
    }
  }

  ngOnDestroy(): void {
    this.refreshSub$?.unsubscribe();
  }
}
