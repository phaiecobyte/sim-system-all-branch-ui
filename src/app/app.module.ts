import {
  APP_INITIALIZER,
  importProvidersFrom,
  NgModule,
  provideZoneChangeDetection,
} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import km from '@angular/common/locales/km';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withInterceptors, withJsonpSupport} from '@angular/common/http';
import { MainComponent } from './pages/main.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';
import { CustomerListComponent } from './pages/customer/customer-list.component';
import { CustomerAddComponent } from './pages/customer/customer-add.component';
import { CustomerEditComponent } from './pages/customer/customer-edit.component';
import { BreadcrumbComponent } from './pages/setting/breadcrumb.component';
import { SettingComponent } from './pages/setting/setting.component';
import { BranchListComponent } from './pages/branch/branch-list.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { catchError, Observable } from 'rxjs';
import { CategoryListComponent } from './pages/category/category-list.component';
import { CategoryAddComponent } from './pages/category/category-add.component';
import { VendorListComponent } from './pages/vendor/vendor-list.component';
import { VendorEditComponent } from './pages/vendor/vendor-edit.component';
import { VendorAddComponent } from './pages/vendor/vendor-add.component';
import { CategoryEditComponent } from './pages/category/category-edit.component';
import { CategoryDeleteComponent } from './pages/category/category-delete.component';
import { RowNumberPipe } from './shared/pipes/row-number.pipe';
import { ItemAddComponent } from './pages/product/product-add.component';
import { ItemDeleteComponent } from './pages/product/product-delete.component';
import { ItemEditComponent } from './pages/product/product-edit.component';
import { ItemListComponent } from './pages/product/product-list.component';
import { VendorDeleteComponent } from './pages/vendor/vendor-delete.component';
import {CategoryMainSelectComponent} from './pages/category-main/category-main-select.component';
import { CategorySelectComponent } from './pages/category/category-select.component';
import { VendorSelectComponent } from './pages/vendor/vendor-select.component';
import { UnitTypeDeleteComponent } from './pages/unitType/unitType-delete.component';
import { UnitTypeAddComponent } from './pages/unitType/unitType-add.component';
import { UnitTypeEditComponent } from './pages/unitType/unitType-edit.component';
import { UnitTypeListComponent } from './pages/unitType/unitType-list.component';
import { UnitTypeSelectComponent } from './pages/unitType/unitType-select.component';
import { CategoryMainListComponent } from './pages/category-main/category-main-list.component';
import { CategoryMainAddComponent } from './pages/category-main/category-main-add.component';
import { CategoryMainEditComponent } from './pages/category-main/category-main-edit.component';
import { CategoryMainDeleteComponent } from './pages/category-main/category-main-delete.component';
import { BrandListComponent } from './pages/brand/brand-list.component';
import { BrandAddComponent } from './pages/brand/brand-add.component';
import { BrandEditComponent } from './pages/brand/brand-edit.component';
import { BrandDeleteComponent } from './pages/brand/brand-delete.component';
import { CustomerDeleteComponent } from './pages/customer/customer-delete.component';
import { CustomerSelectComponent } from './pages/customer/customer-select.component';
import { GenderSelectComponent } from './shared/components/gendor-select.component';
import { CustomerTypeSelectComponent } from './shared/components/customer-type-select.component';
import { BranchAddComponent } from './pages/branch/brand-add.component';
import { BranchEditComponent } from './pages/branch/branch-edit.component';
import { BranchDeleteComponent } from './pages/branch/branch-delete.component';
import { BranchSelectComponent } from './pages/branch/branch-select.component';
import { ShipperListComponent } from './pages/shipper/shipper-list.component';
import { ShipperAddComponent } from './pages/shipper/shipper-add.component';
import { ShipperEditComponent } from './pages/shipper/shipper-edit.component';
import { ShipperDeleteComponent } from './pages/shipper/shipper-delete.component';
import { HomeComponent } from './pages/home/home.component';
import { EmployeeListComponent } from './pages/employee/employee-list.component';
import { EmployeeAddComponent } from './pages/employee/employee-add.component';
import { EmployeeEditComponent } from './pages/employee/employee-edit.component';
import { EmployeeDeleteComponent } from './pages/employee/employee-delete.component';
import { BrandSelectComponent } from './shared/components/brand-select.component';
import { StockTypeSelectComponent } from './shared/components/stock-type-select.component';
import { ProductSelectComponent } from './pages/product/product-select.component';
import { ProductUnitComponent } from "./pages/product-unit/product-unit.component";
import { RoleListComponent } from './pages/role/role-list.component';
import { RoleAddComponent } from './pages/role/role-add.component';
import { RoleEditComponent } from './pages/role/role-edit.component';
import { RoleDeleteComponent } from './pages/role/role-delete.component';
import { RoleSelectComponent } from './shared/components/role-select.component';
import { UserListComponent } from './pages/user/user-list.component';
import { UserAddComponent } from './pages/user/user-add.component';
import { UserSwitchOutline } from '@ant-design/icons-angular/icons';
import { EmployeeSelectComponent } from './shared/components/employee-select.component';
import { SaleListComponent } from './pages/sale/sale-list.component';
import {SaleAddComponent} from './pages/sale/sale-add.component';
import {CdkDropList} from '@angular/cdk/drag-drop';
import {SettingHttpService} from './app-setting';
import {LoginComponent} from './pages/login/login.component';
import {LogoutComponent} from './pages/logout/logout.component';
import {tokenInterceptor} from './helper/token.interceptor';
import {InvoicePrintComponent} from './pages/sale/invoice-print.component';
import {IndeterminateBarComponent} from './shared/components/indeterminate-bar.component';
import {SafePipe} from './shared/pipes/safe.pipe';
import { InvoiceTemplateListComponent } from './pages/invoice-template/invoice-template-list.component';
import { PaymentMethodSelect } from './pages/payment-method/payment-method-select.component';
import { CompanySelectComponent } from './shared/components/company-select.component';
import { InvoiceTemplateAddComponent } from './pages/invoice-template/invoice-template.add.component';
import { InvoiceTemplateEditComponent } from './pages/invoice-template/invoice-template-edit.component';
import { InvoiceTemplateDeleteComponent } from './pages/invoice-template/invoice-template-delete.component';
import { ReportComponent } from './pages/report/report.component';
import { CodeEditorComponent } from "./shared/components/code-editor.component";
registerLocaleData(en);
registerLocaleData(km);

export function app_Init(settingsHttpService: SettingHttpService) {
  return () => settingsHttpService.initializeApp();
}


export class CustomTranslate implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http
      .get(`./i18n/${lang}.json`)
      .pipe(catchError((_) => this.http.get(`./i18n/${lang}.json`)));
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HomeComponent,

    BranchListComponent,
    BranchAddComponent,
    BranchEditComponent,
    BranchDeleteComponent,
    BranchSelectComponent,

    BreadcrumbComponent,
    SettingComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    CustomerListComponent,
    CategoryEditComponent,
    CategoryDeleteComponent,
    CustomerDeleteComponent,
    CustomerSelectComponent,

    CategoryMainSelectComponent,
    CategorySelectComponent,
    VendorSelectComponent,
    UnitTypeSelectComponent,

    VendorListComponent,
    VendorEditComponent,
    VendorAddComponent,
    VendorDeleteComponent,

    CategoryMainListComponent,
    CategoryMainAddComponent,
    CategoryMainEditComponent,
    CategoryMainDeleteComponent,

    CategoryListComponent,
    CategoryAddComponent,

    ItemAddComponent,
    ItemDeleteComponent,
    ItemEditComponent,
    ItemListComponent,
    ProductSelectComponent,

    UnitTypeAddComponent,
    UnitTypeEditComponent,
    UnitTypeDeleteComponent,
    UnitTypeListComponent,

    BrandListComponent,
    BrandAddComponent,
    BrandEditComponent,
    BrandDeleteComponent,
    BrandSelectComponent,

    ShipperListComponent,
    ShipperAddComponent,
    ShipperEditComponent,
    ShipperDeleteComponent,

    GenderSelectComponent,
    CustomerTypeSelectComponent,
    StockTypeSelectComponent,

    EmployeeListComponent,
    EmployeeAddComponent,
    EmployeeEditComponent,
    EmployeeDeleteComponent,
    EmployeeSelectComponent,

    RoleListComponent,
    RoleAddComponent,
    RoleEditComponent,
    RoleDeleteComponent,
    RoleSelectComponent,

    UserListComponent,
    UserAddComponent,

    InvoiceTemplateListComponent,
    InvoiceTemplateAddComponent,
    InvoiceTemplateEditComponent,
    InvoiceTemplateDeleteComponent,

    SaleListComponent,
    SaleAddComponent,
    InvoicePrintComponent,
    IndeterminateBarComponent,
    SafePipe,

    CompanySelectComponent,
    ReportComponent,
    PaymentMethodSelect,

    LoginComponent,
    LogoutComponent

  ],
  imports: [
    CommonModule,
    RouterOutlet,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useClass: CustomTranslate,
            deps: [HttpClient],
        },
    }),
    NgxEchartsModule.forRoot({
        echarts: () => import('echarts')
    }),
    FormsModule,
    RowNumberPipe,
    ProductUnitComponent,
    CdkDropList,
    CodeEditorComponent
],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNzI18n(en_US),
    provideHttpClient(
      withJsonpSupport(),
      withInterceptors([tokenInterceptor])
    ),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      deps: [SettingHttpService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
