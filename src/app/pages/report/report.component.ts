import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../sale/order.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  standalone:false
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  reportData: any[] = [];
  startDate: string;
  endDate: string;

  constructor(
    @Inject(OrderService) private orderService: OrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.reportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  // Add these properties to your component class
  isLoading: boolean = false;
  searchAttempted: boolean = false;

  // Update your generateReport method
  generateReport() {
    if (this.reportForm.valid) {
      this.isLoading = true;
      this.searchAttempted = true;

      const { startDate, endDate } = this.reportForm.value;
      // Format dates to yyyy-mm-dd
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      const encodedStartDate = encodeURIComponent(formattedStartDate);
      const encodedEndDate = encodeURIComponent(formattedEndDate);

      this.orderService
        .getOrderSummary(encodedStartDate, encodedEndDate)
        .subscribe({
          next: (data: any) => {
            this.reportData = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching report data:', error);
            this.isLoading = false;
          }
        });
    }
  }

  // Also update these methods to show loading state
  exportToExcel() {
    this.isLoading = true;

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare data for Excel with proper formatting
    const excelData = this.reportData.map(order => ({
      'Order ID': order.orderId,
      'Customer Name': order.customerName,
      'Order Date': new Date(order.date).toLocaleDateString(),
      'Total Amount': order.amount
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add column headers
    XLSX.utils.sheet_add_aoa(worksheet, [['Order ID', 'Customer Name', 'Order Date', 'Total Amount']], { origin: 'A1' });

    // Auto-size columns
    const max_width = this.reportData.reduce((w, r) => Math.max(w, r.orderId.toString().length), 10);
    worksheet['!cols'] = [
      { wch: max_width },  // Order ID
      { wch: 25 },         // Customer Name
      { wch: 15 },         // Order Date
      { wch: 15 }          // Total Amount
    ];

    // Add total row at the bottom
    const totalRow = excelData.length + 2;
    XLSX.utils.sheet_add_aoa(worksheet, [['', '', 'Total:', this.getTotalAmount()]], { origin: `A${totalRow}` });

    // Style the total row
    if (!worksheet['!rows']) worksheet['!rows'] = [];
    worksheet['!rows'][totalRow - 1] = { hpt: 25 }; // taller row for total

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Save file
    const fileName = `orders_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);

    // Set loading to false when complete
    setTimeout(() => this.isLoading = false, 500);
  }

  printReport() {
    this.isLoading = true;

    // Create a printable version of the report
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report');
      this.isLoading = false;
      return;
    }

    // Generate HTML content for printing
    const printContent = `
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1890ff; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f7f7f7; font-weight: bold; }
            .amount { text-align: right; }
            .total-row { font-weight: bold; border-top: 2px solid #000; }
            .report-period { color: #666; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          <div class="report-period">Period: ${new Date(this.reportForm.value.startDate).toLocaleDateString()} - ${new Date(this.reportForm.value.endDate).toLocaleDateString()}</div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Order Date</th>
                <th class="amount">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${this.reportData.map(order => `
                <tr>
                  <td>${order.orderId}</td>
                  <td>${order.customerName}</td>
                  <td>${new Date(order.date).toLocaleDateString()}</td>
                  <td class="amount">$${order.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Total</td>
                <td class="amount">$${this.getTotalAmount().toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      this.isLoading = false;
    };

    // Fallback in case onload doesn't trigger
    setTimeout(() => {
      if (this.isLoading) {
        printWindow.print();
        this.isLoading = false;
      }
    }, 1000);
  }

  getTotalAmount(): number {
    return this.reportData.reduce((sum, order) => sum + order.amount, 0);
  }
}

