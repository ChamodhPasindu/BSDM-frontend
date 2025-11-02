import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Main',
  },
  {
    name: 'Dashboard',
    url: '/admin/post-login/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },

  {
    title: true,
    name: 'Manage',
  },
  {
    name: 'Employee',
    url: '/admin/post-login/employees',
    iconComponent: { name: 'cil-group' },
  },
  {
    name: 'Vehicle',
    url: '/admin/post-login/vehicles',
    iconComponent: { name: 'cil-truck' },
  },
  {
    name: 'Customer & Routes',
    url: '/admin/post-login/customer-routes',
    iconComponent: { name: 'cil-sitemap' },
  },

  {
    title: true,
    name: 'Inventory',
  },
  {
    name: 'Store Management',
    url: '/admin/post-login/inventory',
    iconComponent: { name: 'cil-layers' },
    children: [
      {
        name: 'Product ',
        url: '/admin/post-login/inventory/product',
      },
      {
        name: 'Stock ',
        url: '/admin/post-login/inventory/stock',
      },
      {
        name: 'Sales Stock Assign',
        url: '/admin/post-login/inventory/sales-stock',
      },
      {
        name: 'Stock Return',
        url: '/admin/post-login/inventory/return-stock',
      },
    ],
  },

  {
    title: true,
    name: 'Income',
  },
  {
    name: 'Sales & Delivery',
    url: '/admin/post-login/sales-delivery-tracking',
    iconComponent: { name: 'cil-chart-line' },
  },
  {
    name: 'Payments',
    url: '/admin/post-login/payments',
    iconComponent: { name: 'cil-bank' },
  },

  {
    title: true,
    name: 'Others',
  },
  {
    name: 'Audit Trail',
    url: '/admin/post-login/audit-trail',
    iconComponent: { name: 'cil-folder-open' },
  },
  {
    name: 'Alerts',
    url: '/admin/post-login/alerts',
    iconComponent: { name: 'cil-bell' },
  },
  {
    name: 'Settings',
    url: '/admin/post-login/settings',
    iconComponent: { name: 'cil-settings' },
  },
];
