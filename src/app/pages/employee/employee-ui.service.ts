import { EventEmitter, Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { EmployeeAddComponent } from "./employee-add.component";
import { EmployeeEditComponent } from "./employee-edit.component";
import { EmployeeDeleteComponent } from "./employee-delete.component";

@Injectable({
  providedIn:'root'
})

export class EmployeeUiService{
  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: EmployeeAddComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-employee',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'added', data: e.model});
      }
    })
  }

  public showEdit(id:number){
    this.modal.create({
      nzContent: EmployeeEditComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-employee',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: EmployeeDeleteComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-add-employee',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }
}
