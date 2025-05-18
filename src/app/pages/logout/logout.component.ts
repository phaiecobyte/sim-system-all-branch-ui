import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from '../auth/auth.service';
import {APP_STORAGE_KEY} from '../../const';

@Component({
  selector: 'app-admin-logout',
  template: `
   <nz-spin></nz-spin>
  `,
  standalone: false,
  styles: [`
    nz-spin{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `]
})


export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
      this.authService.logout(APP_STORAGE_KEY.AUTHORIZED).subscribe(() => {
        this.router.navigate(['/','login']).then();
      });
  }
}
