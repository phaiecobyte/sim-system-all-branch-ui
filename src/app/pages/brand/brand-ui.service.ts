import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import { BrandAddComponent } from './brand-add.component';
import { BrandEditComponent } from './brand-edit.component';
import { BrandDeleteComponent } from './brand-delete.component';

@Injectable({
  providedIn: 'root'
})

export class BrandUiService {

  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: BrandAddComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-brand',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'added', data: e.model});
      }
    })
  }

  public showEdit(id:number){
    this.modal.create({
      nzContent: BrandEditComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-brand',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: BrandDeleteComponent,
      nzWidth: '450px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-brand',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }
}
