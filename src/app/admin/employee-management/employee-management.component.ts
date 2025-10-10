import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'role', 'status', 'lastActive', 'actions'];
  dataSource!: MatTableDataSource<Employee>;
  
  employees: Employee[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@rk.com',
      role: 'Sales Manager',
      status: 'Active',
      lastActive: '2025-09-12 14:22'
    },
    {
      id: 2,
      name: 'Maria Chen',
      email: 'maria.chen@rk.com',
      role: 'Product Designer',
      status: 'Active',
      lastActive: '2025-09-12 12:03'
    },
    {
      id: 3,
      name: 'Samir Patel',
      email: 'samir.patel@rk.com',
      role: 'Data Analyst',
      status: 'Active',
      lastActive: '2025-09-11 18:44'
    },
    {
      id: 4,
      name: 'Julia Kim',
      email: 'julia.kim@rk.com',
      role: 'HR Generalist',
      status: 'Suspended',
      lastActive: '2025-09-07 09:10'
    },
    {
      id: 5,
      name: 'Diego Rivera',
      email: 'diego.rivera@rk.com',
      role: 'Support Lead',
      status: 'Active',
      lastActive: '2025-09-08 15:02'
    },
    {
      id: 6,
      name: 'Priya Nair',
      email: 'priya.nair@rk.com',
      role: 'Finance Analyst',
      status: 'Active',
      lastActive: '2025-09-01 11:37'
    }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isLoading = false;
  totalEmployees = 248;
  activeEmployees = 221;
  suspendedEmployees = 27;

  ngOnInit() {
    this.initializeTable();
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource(this.employees);
    // Set up paginator and sort after view init
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getRoleClass(role: string): string {
    const roleClasses: { [key: string]: string } = {
      'Sales Manager': 'sales',
      'Product Designer': 'design',
      'Data Analyst': 'analytics',
      'HR Generalist': 'hr',
      'Support Lead': 'support',
      'Finance Analyst': 'finance'
    };
    return roleClasses[role] || 'default';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  viewEmployee(employee: Employee) {
    console.log('View employee:', employee);
    // Implement view logic
  }

  editEmployee(employee: Employee) {
    console.log('Edit employee:', employee);
    // Implement edit logic
  }

  deleteEmployee(employee: Employee) {
    console.log('Delete employee:', employee);
    // Implement delete logic with confirmation
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      // Delete logic here
    }
  }
}
