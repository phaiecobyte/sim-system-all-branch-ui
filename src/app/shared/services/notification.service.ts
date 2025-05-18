import { Injectable } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn:'root'
})

export class NotificationService {
  constructor(
    private notification:NzNotificationService,
    private translateService:TranslateService
  ){}

  showAddSuccess(message="Add has been successfully!" ,title= "Success"):void{
    this.notification.success(this.translateService.instant(title), this.translateService.instant(message));
  }
  showEditSuccess(message="Update has been successfully!",title="Success"):void{
    this.notification.success(this.translateService.instant(title), this.translateService.instant(message));
  }
  showDeleteSuccess(message="Delete has been successfully!",title="Success"):void{
    this.notification.success(this.translateService.instant(title),this.translateService.instant(message));
  }

  showError(message:string,title:string="Error"):void{
    this.notification.error(message,title)
  }
  showWarning(message:string,title:string):void{
    this.notification.warning(title,message);
  }
  showInfo(message:string,title:string):void{
    this.notification.info(title,message);
  }
}
