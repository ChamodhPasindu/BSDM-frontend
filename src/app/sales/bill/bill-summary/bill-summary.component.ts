import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss'],
})
export class BillSummaryComponent implements OnInit {
  constructor(private bottomSheetService: NgxBottomSheetService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit() {}
  // 🧍 Dummy Customer
  selectedCustomer = {
    name: 'Chamodh Pasindu',
    shopName: 'Visco Traders',
    address: 'No. 23, Main Street, Kandy',
    overdueAmount: 1250.0,
  };

  // 🛒 Dummy Products
  selectedProducts = [
    { name: 'Milo Packet', qty: 2, maxPrice: 450.0 },
    { name: 'Soda Bottle', qty: 5, maxPrice: 200.0 },
    { name: 'Milk Powder', qty: 1, maxPrice: 1150.0 },
    { name: 'Soda Bottle', qty: 5, maxPrice: 200.0 },
    { name: 'Milk Powder', qty: 1, maxPrice: 1150.0 },
    { name: 'Milo Packet', qty: 2, maxPrice: 450.0 },
  ];

  // 🧮 Get Total of selected products
  getTotalAmount(): number {
    return this.selectedProducts.reduce(
      (total, p) => total + p.qty * p.maxPrice,
      0
    );
  }

  // 🛍 Count of selected products
  getSelectedCount(): number {
    return this.selectedProducts.length;
  }

  // 🔙 Dummy navigation or edit event
  editOrder() {
    this.bottomSheetService.close();
  }

  // ✅ Confirm submit event
  confirmOrder() {
    this.bottomSheetService.close();
    this.router.navigate(['sales/post-login'],{relativeTo:this.route})

    Swal.fire({
      title: 'Bill Added Successfully!',
      text: 'Do you want pay the bill now ?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Now',
      cancelButtonText: 'No, Later',
      reverseButtons: true,
      customClass: {
        popup: 'coreui-popup',
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    }).then((result) => {

      if (result.isConfirmed) {
      }
    });
  }
}
