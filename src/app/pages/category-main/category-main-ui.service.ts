import { EventEmitter, Injectable } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { CategoryMainAddComponent } from "./category-main-add.component";
import { CategoryMainEditComponent } from "./category-main-edit.component";
import { CategoryMainDeleteComponent } from "./category-main-delete.component";

@Injectable({
  providedIn:'root'
})
export class CategoryMainUiService {
  constructor(
    private modal: NzModalService,
  ) { }

  refresher: EventEmitter<{operation: string, data: any,componentId?: string,}> = new EventEmitter<{ operation: string, data: any,componentId?: string}>();


  public showAdd(){
    this.modal.create({
      nzContent: CategoryMainAddComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzClassName: 'modal-add-category-main',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'added', data: e.model});
      }
    })
  }

  public showEdit(id:number){
    this.modal.create({
      nzContent: CategoryMainEditComponent,
      nzWidth: '700px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-edit-category-main',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'edited', data: e.model});
      }
    })
  }

  public showDelete(id:number){
    this.modal.create({
      nzContent: CategoryMainDeleteComponent,
      nzWidth: '450px',
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzData: {id},
      nzClassName: 'modal-delete-category-main',
      nzStyle: {top: '20px'},
      nzOnOk: (e:any) => {
        this.refresher.emit({operation: 'deleted', data: e.model});
      }
    })
  }

}
