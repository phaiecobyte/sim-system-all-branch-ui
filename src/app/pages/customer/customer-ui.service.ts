import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {CustomerAddComponent} from './customer-add.component';
import {CustomerEditComponent} from './customer-edit.component';
import { CustomerDeleteComponent } from './customer-delete.component';

@Injectable({
  providedIn: 'root'
})

export class CustomerUiService {
  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: CustomerAddComponent,
      nzWidth: '900px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-customer',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'added', data: e.model});
      }
    })
  }

  public showEdit(id:number){
    this.modal.create({
      nzContent: CustomerEditComponent,
      nzWidth: '900px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-edit-customer',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: CustomerDeleteComponent,
      nzWidth: '860px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-delete-customer',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }

}
