import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import { InvoiceTemplateAddComponent } from './invoice-template.add.component';
import { InvoiceTemplateEditComponent } from './invoice-template-edit.component';
import { InvoiceTemplateDeleteComponent } from './invoice-template-delete.component';

@Injectable({
  providedIn: 'root'
})

export class InvoiceTemplateUiService {

  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: InvoiceTemplateAddComponent,
      nzWidth: '1200px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-invoice-template',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'added', data: e.model});
      }
    })
  }

  public showEdit(id:number){
    this.modal.create({
      nzContent: InvoiceTemplateEditComponent,
      nzWidth: '1200px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-edit-invoice-template',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: InvoiceTemplateDeleteComponent,
      nzWidth: '450px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-delete-invoice-template',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }
}
