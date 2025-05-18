import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {AUTH_TYPE, AuthService, ClientInfo} from '../auth/auth.service';
import {LocalstorageService} from '../../shared/services/localstorage.service';
import {NotificationService} from '../../shared/services/notification.service';
import {APP_STORAGE_KEY} from '../../const';

@Component({
  selector: 'app-admin-login',
  template: `
    <nz-layout>
      <nz-content>
        <div class="container">
          <div nz-flex nzJustify="center" nzAlign="center">
            <form nz-form [formGroup]="frm" class="login-form" (ngSubmit)="onSubmit()">
              <div class="user-icon">
                <span nz-icon nzType="user" nzTheme="outline"></span>
              </div>
              <div nz-flex nzJustify="center">
                <h4 class="title-form" nz-typography>Login to your account</h4>
              </div>
              <nz-form-item>
                <nz-form-control nzErrorTip="Please input your username!">
                  <nz-input-group nzPrefixIcon="user">
                    <input type="text" nz-input formControlName="username" placeholder="Username"/>
                  </nz-input-group>
                </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                <nz-form-control nzErrorTip="{{'Please input your Password!'}}">
                  <nz-input-group nzPrefixIcon="lock">
                    <input type="password" nz-input formControlName="password" placeholder="Password"/>
                  </nz-input-group>
                  <div class="error" *ngIf="error">
                    <p>{{error}}</p>
                  </div>
                </nz-form-control>
              </nz-form-item>

              <button [nzLoading]="isLoading" nz-button class="login-form-button login-form-margin" [nzType]="'primary'">
                Login
              </button>

              <button type="button" [routerLink]="['/']" nz-button class="back-button" [nzType]="'text'">
                <span nz-icon nzType="left" nzTheme="outline"></span>
                Back
              </button>
            </form>
          </div>
        </div>
      </nz-content>
    </nz-layout>


  `,
  styles: [`
    nz-layout::before{
      content: "";
      background-image: url('/images/admin-login-background.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.3;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: 0;
    }

    .container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;

      [nz-flex] {
        height: 100%;
      }
    }

    .user-icon{
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(8px);
      border-radius: 50%;
      padding: 12px;
      box-shadow: rgba(17, 17, 26, 0.1) 0 4px 16px, rgba(17, 17, 26, 0.05) 0 8px 32px;
      > span{
        font-size: 40px;
      }
    }



    .btn-register {
      background: #f7f9fa;
      padding:  4px 15px;
      text-align: center;
      border-radius: 2px;
      margin-top: 16px;
      p{
        margin: 0;
      }
    }
    .nz-no-padding{
      width: 33px;
      img{
        width: 80% !important;
        height: 80% !important;
        inset: 3px !important;
      }
    }
    .logo {
      width: 25%;
      aspect-ratio: 4/3;
      object-fit: contain;
      margin: 0 0 20px 0;
    }

    .title-form {
      margin: 15px 0 30px 0;
      text-align: center;
    }

    .login-form {
      min-width: 360px;
      max-width: 360px;
      backdrop-filter: blur(8px);
      padding: 30px;
      border-radius: 8px;
      box-shadow: rgba(17, 17, 26, 0.1) 0 4px 16px, rgba(17, 17, 26, 0.05) 0 8px 32px;
    }

    .login-form-margin {
      margin-bottom: 16px;
    }

    .login-form-button {
      width: 100%;
    }
    .back-button{
      width: 100%;
      margin-top: 16px;
    }
    .error{
      position: absolute;
      z-index: 99;
      top: 32px;
      color: var(--ant-error-color);
      font-size: 13px;
    }
  `],
  standalone: false
})


export class LoginComponent implements OnInit {
  frm!: FormGroup;
  isLoading: boolean = false;
  error!: string;
  isWrongCredential: boolean = false;
  authType: number = 0;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe((param:any) => {
      this.authType = param.type;
    })
  }

  initForm(): void {
    this.frm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  onSubmit(): void {
    if (this.frm.valid) {
      this.isLoading = true;
      this.authService.login(this.frm.value).subscribe({
        next: async (res: ClientInfo ) => {
          this.router.navigate([`/home`]).then();
          this.isLoading = false;
        }, error: (err: HttpErrorResponse) => {
          this.isWrongCredential = true;
          this.error = err.error.message;
          this.isLoading = false;
        }
      });
    } else {
      Object.values(this.frm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

}
