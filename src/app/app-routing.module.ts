import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BranchListComponent } from "./pages/branch/branch-list.component";
import { BrandListComponent } from "./pages/brand/brand-list.component";
import { CategoryMainListComponent } from "./pages/category-main/category-main-list.component";
import { CategoryListComponent } from "./pages/category/category-list.component";
import { CustomerListComponent } from "./pages/customer/customer-list.component";
import { HomeComponent } from "./pages/home/home.component";
import { ItemListComponent } from "./pages/product/product-list.component";
import { MainComponent } from "./pages/main.component";
import { SettingComponent } from "./pages/setting/setting.component";
import { ShipperListComponent } from "./pages/shipper/shipper-list.component";
import { UnitTypeListComponent } from "./pages/unitType/unitType-list.component";
import { VendorListComponent } from "./pages/vendor/vendor-list.component";
import { EmployeeListComponent } from "./pages/employee/employee-list.component";
import { ProductUnitComponent } from "./pages/product-unit/product-unit.component";
import { RoleListComponent } from "./pages/role/role-list.component";
import { UserListComponent } from "./pages/user/user-list.component";
import { SaleListComponent } from "./pages/sale/sale-list.component";
import {LoginComponent} from './pages/login/login.component';
import {pageAdminGuard} from './helper/page-admin.guard';
import {authAdminGuard} from './helper/auth-admin.guard';
import { InvoiceTemplateListComponent } from "./pages/invoice-template/invoice-template-list.component";
import { LogoutComponent } from "./pages/logout/logout.component";
import { ReportComponent } from "./pages/report/report.component";
import { CodeEditorComponent } from "./shared/components/code-editor.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: '',
    canActivate: [authAdminGuard],
    component: MainComponent,
    children: [
      {path: 'home',component: HomeComponent,data: { title: 'Home' }},
      {path: 'branch',component: BranchListComponent,data:{title:'Branch'}},
      {path: 'brand',component: BrandListComponent,data:{title:'Brand'}},
      {path: 'customer',component: CustomerListComponent,data:{title:'Customer'}},
      {path: 'category',component: CategoryListComponent,data:{title:'Category'}},
      {path: 'vendor',component: VendorListComponent,data:{title:'Vendor'}},
      {path: 'setting',component: SettingComponent,data:{title:'Setting'}},
      {path: 'item',component: ItemListComponent,data:{title:'Product'}},
      {path: 'unitType',component: UnitTypeListComponent,data:{title:'UnitType'}},
      {path: 'categoryMain',component: CategoryMainListComponent,data:{title:'CategoryMain'}},
      {path: 'shipper',component: ShipperListComponent,data:{title:'Shipper'}},
      {path: 'employee',component:EmployeeListComponent,data:{title:'Employee'}},
      {path: 'product-unit',component:ProductUnitComponent,data:{title:'Product Unit'}},
      {path: 'role',component:RoleListComponent,data:{title:'Role'}},
      {path: 'user',component:UserListComponent,data:{title:'User'}},
      {path: 'sale',component:SaleListComponent,data:{title:'Sale'}},
      {path: 'report',component:ReportComponent,data:{title:'Report'}},
      {
        path: 'code-editor-test',
        component: CodeEditorComponent,
        data: {title: 'Code Editor Test'}
      },

      {
        path: 'setting/invoice-template',
        component: InvoiceTemplateListComponent,
        data: [
          { index: 0, label: 'Setting', url: '/setting' },
          { index: 2, label: 'Invoice Template', url: '/invoice-template' },
        ],
      },
      {
        path: 'logout',
        component: LogoutComponent,
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [pageAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
