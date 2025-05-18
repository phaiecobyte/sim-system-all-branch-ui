import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import { UnitTypeAddComponent } from './unitType-add.component';
import { UnitTypeDeleteComponent } from './unitType-delete.component';
import { UnitTypeEditComponent } from './unitType-edit.component';


@Injectable({
  providedIn: 'root'
})

export class UnitTypeUiService {

  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: UnitTypeAddComponent,
      nzWidth: '700px',
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
      nzContent: UnitTypeEditComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-customer',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: UnitTypeDeleteComponent,
      nzWidth: '450px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-customer',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }

}
