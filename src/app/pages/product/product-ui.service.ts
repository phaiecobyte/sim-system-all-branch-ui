import { NzModalService } from 'ng-zorro-antd/modal';

import { EventEmitter, Injectable } from '@angular/core';
import { ItemAddComponent } from './product-add.component';
import { ItemEditComponent } from './product-edit.component';
import { ItemDeleteComponent } from './product-delete.component';


@Injectable({
  providedIn: 'root',
})
export class ItemUiService {
   constructor(
      private modal: NzModalService,
    ) { }

    refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();

    public showAdd(){
      this.modal.create({
        nzContent: ItemAddComponent,
        nzWidth: '950px',
        nzFooter: null,
        nzMaskClosable: false,
        nzClosable: true,
        nzClassName: 'modal-add-item',
        nzStyle: {top: '20px'},
        nzOnOk: (e:any) => {
          this.refresher.emit({operation: 'added', data: e.model});
        }
      })
    }

    public showEdit(id:number){
      this.modal.create({
        nzContent: ItemEditComponent,
        nzWidth: '950px',
        nzFooter: null,
        nzMaskClosable: false,
        nzClosable: true,
        nzData: {id},
        nzClassName: 'modal-edit-item',
        nzStyle: {top: '20px'},
        nzOnOk: (e:any) => {
          this.refresher.emit({operation: 'edited', data: e.model});
        }
      })
    }

    public showDelete(id:number){
      this.modal.create({
        nzContent: ItemDeleteComponent,
        nzWidth: '860px',
        nzFooter: null,
        nzMaskClosable: false,
        nzClosable: true,
        nzData: {id},
        nzClassName: 'modal-delete-item',
        nzStyle: {top: '20px'},
        nzOnOk: (e:any) => {
          this.refresher.emit({operation: 'deleted', data: e.model});
        }
      })
    }

}
