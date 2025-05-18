import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { NzIconService } from "ng-zorro-antd/icon"; // Import NzIconService for custom icons

@Component({
  selector: 'app-main',
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzCollapsible
        nzWidth="246px"
        nzTheme="light"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div class="sidebar-logo">
          <div class="img-logo">
            <img src="./images/image_logo.jpg" alt="logo" />
          </div>
          <h1 *ngIf="!isCollapsed">SSAB</h1>
        </div>
        <div class="scrollbar">
          <ul
            class="menu-custom"
            nz-menu
            nzTheme="light"
            nzMode="inline"
            [nzInlineCollapsed]="isCollapsed"
            [nzSelectable]="true"
          >
            <li nz-menu-item nzMatchRouter [routerLink]="['home']">
              <nz-icon nzType="home" nzTheme="outline" />
              <span>{{'Home' | translate}}</span>
            </li>
            <li nz-menu-item nzMatchRouter [routerLink]="['sale']">
              <nz-icon nzType="reconciliation"/>
              <span>{{'Sale' | translate}}</span>
            </li>
            <li nz-submenu [nzOpen]="isMenuOpen('product')" nzTitle="{{'Product' | translate}}" nzIcon="shopping-cart">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['item']">
                  <a>{{'Product' | translate}}</a>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['category']">
                  <a>{{'Category' | translate}}</a>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['unitType']">
                  <a>{{'UnitType' | translate}}</a>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['brand']">
                  <a>{{'Brand' | translate}}</a>
                </li>
              </ul>
            </li>
            <li nz-submenu [nzOpen]="isMenuOpen('install')" nzTitle="{{'Install' | translate}}" nzIcon="vertical-align-top">
              <ul class="submenu-custom">
                  <li nz-menu-item nzMatchRouter [routerLink]="['customer']">
                    <a>{{'Customer' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['vendor']">
                    <a>{{'Vendor' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['branch']">
                    <a>{{'Branch' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['shipper']">
                    <a>{{'Shipper' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['categoryMain']">
                    <a>{{'Category Main' | translate}}</a>
                  </li>
                </ul>
            </li>
            <li nz-submenu [nzOpen]="isMenuOpen('security')" nzTitle="{{'Security' | translate}}" nzIcon="lock">
              <ul class="submenu-custom">
                  <li nz-menu-item nzMatchRouter [routerLink]="['employee']">
                    <a>{{'Manage' | translate}}{{'Employee' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['user']">
                    <a>{{'Manage' | translate}}{{'User' | translate}}</a>
                  </li>
                  <li nz-menu-item nzMatchRouter [routerLink]="['role']">
                    <a>គ្រប់គ្រងតួនាទី</a>
                  </li>

                </ul>
            </li>
            <li nz-submenu [nzOpen]="isMenuOpen('report')" nzTitle="{{'Report' | translate}}" nzIcon="reconciliation">
              <ul class="submenu-custom">
                  <li nz-menu-item nzMatchRouter [routerLink]="['report']">
                    <a>លក់</a>
                  </li>
                </ul>
            </li>
            <li nz-menu-item nzMatchRouter [routerLink]="['setting']">
              <nz-icon nzType="setting" nzTheme="outline" />
              <span>{{'Setting' | translate}}</span>
            </li>
          </ul>
        </div>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
              <span
                class="trigger"
                nz-icon
                [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"
              ></span>
            </span>
            <span class="page-title">{{ pageTitle | translate}}</span>
            <div class="user-profile" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
              <nz-avatar nzIcon="user" class="avatar"></nz-avatar>
              <span class="username">{{ username }}</span>
              <nz-dropdown-menu #userMenu="nzDropdownMenu">
                <ul nz-menu>
                  <!-- <li nz-menu-item (click)="viewProfile()">
                    <nz-icon nzType="user" nzTheme="outline"></nz-icon>
                    {{'Profile' | translate}}
                  </li> -->
                  <li nz-menu-item (click)="logout()">
                    <nz-icon nzType="logout" nzTheme="outline"></nz-icon>
                    {{'Logout' | translate}}
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styleUrls: ['../shared/scss/main.style.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MainComponent implements OnInit {
  isCollapsed = false;
  pageTitle: string = '';
  username: string = 'Admin'; // Replace with dynamic username from your auth service
  currentUrl: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconService: NzIconService // Inject NzIconService for custom icons
  ) {
    // Add custom icons if needed
    this.iconService.addIcon({
      name: 'user',
      theme: 'outline',
      icon: `<svg viewBox="64 64 896 896" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="user" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>`,
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        this.pageTitle = route?.snapshot.data['title'];
      });
  }

  isMenuOpen(menuType: string): boolean {
    const productRoutes = ['item', 'category', 'unitType', 'brand', 'categoryMain'];
    const installRoutes = ['customer', 'vendor', 'branch', 'shipper'];
    const securityRoutes = ['employee', 'user', 'role', 'group-member'];
    const reportRoutes = ['report'];

    if (menuType === 'product') {
      return this.isRouteActive(productRoutes);
    } else if (menuType === 'install') {
      return this.isRouteActive(installRoutes);
    } else if (menuType === 'security') {
      return this.isRouteActive(securityRoutes);
    } else if (menuType === 'report') {
      return this.isRouteActive(reportRoutes);
    }
    return false;
  }

  isRouteActive(routes: string[]): boolean {
    return routes.some(route => this.currentUrl.includes(`/${route}`));
  }

  viewProfile(): void {
    // Navigate to the user profile page
    this.router.navigate(['/profile']);
  }

  logout(): void {
    // Implement logout logic her
    this.router.navigate(['/logout']);
  }
}
