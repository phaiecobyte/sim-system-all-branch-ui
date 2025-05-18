import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { User, UserService } from './user.service';
import { NotificationService } from '../../shared/services/notification.service';
import { CommonValidators } from '../../shared/services/common-validators';

@Component({
  selector: 'app-user-add',
  template: `
    <div *nzModalTitle>
      <span>{{'Add' | translate}}{{'User' | translate}}</span>
    </div>
    <div *nzModalContent>
      <form [formGroup]="frm">
        <nz-form-item  nzFlex>
          <nz-form-label nzFor="" nzSpan="1-24" nzRequired>ឈ្មោះបុគ្គលិក</nz-form-label>
          <nz-form-control nzSpan="1-24">
            <app-employee-select formControlName="staffId"/>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <div nz-flex nzJustify="end" nzGap="small">
        <button nz-button nzType="primary" (click)="onSubmit()">{{'Save' | translate}}</button>
        <button nz-button (click)="closeModal()">{{'Cancel' | translate}}</button>
      </div>
    </div>
  `,
  standalone: false,
  styleUrls: ['../../shared/scss/operation.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserAddComponent implements OnInit {
  constructor(
    protected modal: NzModalRef<UserAddComponent>,
    private fb: FormBuilder,
    private service: UserService,
    private notification: NotificationService
  ) {}

  autoTips = CommonValidators.autoTips;
  isLoading: boolean = false;
  frm!: FormGroup;
  model: User;

  ngOnInit(): void {
    this.initControl();
  }

  initControl(): void {
    const { required } = CommonValidators;
    this.frm = this.fb.group({
      userId: [null, [required]],
      staffId: [null, [required]],
      phone: [null, [required]],
      warehouseId: [0, [required]],
      roleId: [0, [required]],
      username: [null, [required]],
      password: [null, [required]],
      expireDate: [null, [required]],
    });
  }

  onSubmit() {
    if (this.frm.valid) {
      this.isLoading = true;
      this.service.add(this.frm.value).subscribe({
        next: (user: User): void => {
          console.log('user', user);
          this.model = user;
          this.notification.showAddSuccess();
        },
        error: (error): void => {
          this.isLoading = false;
          console.log(error);
        },
        complete: async () => {
          this.isLoading = false;
          await this.modal.triggerOk();
        },
      });
    }
  }

  closeModal() {
    this.modal.close();
  }
}
