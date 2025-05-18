import { Component, OnDestroy, OnInit } from '@angular/core';
import { BranchSelectComponent } from '../branch/branch-select.component';
import { Branch, BranchService } from '../branch/branch.service';
import { QueryParam } from '../../shared/services/base-api.service';
import { Customer, CustomerService } from '../customer/customer.service';
import { ItemService, Product } from '../product/product.service';
import { ItemUiService } from '../product/product-ui.service';
import { CustomerUiService } from '../customer/customer-ui.service';
import { Order, OrderService } from '../sale/order.service';
import { SaleUiService } from '../sale/sale-ui.service';
import { InvoiceTemplateUiService } from '../invoice-template/invoice-template-ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone:false
})
export class HomeComponent implements OnInit,OnDestroy{

  branchCount:number = 0;
  customerCount:number=0;
  productCount:number=0;
  orderCount:number=0;
  param:QueryParam={
    pageIndex:1,
    pageSize:10000000,
    sorts:'',
    filters:''
  }
  constructor(
    private branchService:BranchService,
    private customerService:CustomerService,
    private productService:ItemService,
    public productUiService:ItemUiService,
    public customerUiService:CustomerUiService,
    public saleUiService:SaleUiService,
    public templateUiService:InvoiceTemplateUiService,
    public orderService:OrderService
  ){}
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.fetchBranches();
    this.fetchCustomers();
    this.fetchProducts();
    this.fetchOrder();
  }

  fetchOrder(){
    this.orderService.search(this.param).subscribe({
      next:(result:{results:Order[],param:QueryParam})=>{
        this.orderCount = result.results.length;
        this.param = result.param;
      },
      error(error){
        console.log(error);
      }
    })
  }

  fetchBranches(){
    this.branchService.search(this.param).subscribe({
      next: (result: {results: Branch[], param: QueryParam}) => {
        this.branchCount = result.results.length;
        this.param = result.param;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  fetchCustomers(){
    this.customerService.search(this.param).subscribe({
      next:(result:{results:Customer[],param:QueryParam})=>{
        this.customerCount = result.results.length;
        this.param = result.param;
      },error:(error)=>{
        console.log(error);
      }
    })
  }

  fetchProducts(){
    this.productService.search(this.param).subscribe({
      next:(result:{results:Product[],param:QueryParam})=>{
        this.productCount = result.results.length;
        this.param = result.param;
      },
      error(error){
        console.log(error);
      }
    })
  }

  // Bar Chart Data
  barChartOptions = {
    xAxis: {
      type: 'category',
      data: ['ដែក', 'វីស', 'ថ្នាំព៌ណ', 'កញ្ចក់', 'សង្កសី']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70],
      type: 'bar'
    }]
  };

  // Pie Chart Data
  pieChartOptions = {
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: 'Order Status',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 40, name: 'Pending' },
        { value: 30, name: 'Completed' },
        { value: 20, name: 'Cancelled' },
        { value: 10, name: 'In Progress' }
      ]
    }]
  };

  // Recent Activities Data
  recentActivities = [
    { date: '2024-10-01', description: 'Added 100 units of Steel', user: 'Chanthorn' },
    { date: '2024-10-02', description: 'Created Order #123', user: 'Srey Den' },
    { date: '2024-10-03', description: 'Updated Product', user: 'Khorn Thanlinith' },
    { date: '2024-10-03', description: 'Added 5 categories', user: 'Sophea Pov' },
    { date: '2024-10-03', description: 'Updated Material Inventory', user: 'Phal Phai' },
    { date: '2024-10-03', description: 'Updated Material Inventory', user: 'Admin' },
  ];
}
