import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {MainPageService} from '../../shared/services/main-page.service';
import {SaleAddComponent} from './sale-add.component';
import {InvoicePrintComponent} from './invoice-print.component';

@Injectable({
  providedIn: 'root'
})
export class SaleUiService {
  constructor(
    private modalService: NzModalService,
    private mainPageService: MainPageService,
  ) {}
  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();

  showAdd() {
    this.modalService.create({
      nzContent: SaleAddComponent,
      nzWidth: '100%',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-shipper',
      nzBodyStyle: this.mainPageService.getModalBodyStyle(),
      nzStyle: { ...this.mainPageService.getModalFullPageSize(), top: '50%', transform: 'translateY(-50%)' },
      nzOnOk: (e: any) => {
        this.refresher.emit({ operation: 'added', data: e.model });
      }
    });
  }

  showPrint(id: number) {
    this.modalService.create({
      nzContent: InvoicePrintComponent,
      nzData: {
        id: id,
      },
      nzCentered: true,
      nzClosable: true,
      nzWidth: '75%',
      nzBodyStyle: {...this.mainPageService.getModalBodyStyle()},
      nzStyle: { ...this.mainPageService.getModalFullPageSize(), top: '10%', transform: 'translateY(-10%)' },
      nzMaskClosable: false,
    });
  }

  showEdit(id: number){

  }

  showDelete(id: number){

  }

}
