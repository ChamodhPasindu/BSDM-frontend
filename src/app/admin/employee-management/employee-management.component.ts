import { Component, OnInit } from '@angular/core';

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
  constructor() {}

  ngOnInit() {}

  employees: Employee[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@rk.com',
      role: 'Sales Manager',
      status: '0.5%',
      lastActive: '2025-09-12 14:22',
    },
    {
      id: 2,
      name: 'Maria Chen',
      email: 'maria.chen@rk.com',
      role: 'Product Designer',
      status: '0.5%',
      lastActive: '2025-09-12 12:03',
    },
    {
      id: 3,
      name: 'Samir Patel',
      email: 'samir.patel@rk.com',
      role: 'Data Analyst',
      status: '0.5%',
      lastActive: '2025-09-11 18:44',
    },
    {
      id: 4,
      name: 'Julia Kim',
      email: 'julia.kim@rk.com',
      role: 'HR Generalist',
      status: '0.5%',
      lastActive: '2025-09-07 09:10',
    },
    {
      id: 5,
      name: 'Diego Rivera',
      email: 'diego.rivera@rk.com',
      role: 'Support Lead',
      status: '0.5%',
      lastActive: '2025-09-08 15:02',
    },
    {
      id: 6,
      name: 'Priya Nair',
      email: 'priya.nair@rk.com',
      role: 'Finance Analyst',
      status: '0.5%',
      lastActive: '2025-09-01 11:37',
    },
  ];
}
