export const UserRoles: Record<string, string>[] = [
  { value: 'ADMIN', title: 'Admin' },
  { value: 'SALESMAN', title: 'Salesman' },
  { value: 'SUPERADMIN', title: 'Super Admin' },
];

export const UserStatus: Record<string, string>[] = [
  { value: 'ACTIVE', title: 'Active' },
  { value: 'DEACTIVATE', title: 'Deactivate' },
];

export const VehicleTypeList: Record<string, string>[] = [
  { value: 'CAR', title: 'Car' },
  { value: 'VAN', title: 'Van' },
  { value: 'LORRY', title: 'Lorry' },
  { value: '3WHEEL', title: '3 Wheeler' },
  { value: 'BIKE', title: 'Motor Cycle' },
];

export const SalesStatus: Record<string, string>[] = [
  { code: 'ALL', description: 'All' },
  { code: 'DRAFT_ORDER', description: 'Draft' },
  { code: 'IN_PROGRESS_ORDER', description: 'In Progress' },
  { code: 'COMPLETED_ORDER', description: 'Completed' },
  { code: 'CANCELLED_ORDER', description: 'Cancelled' },
  { code: 'EXPIRED_ORDER', description: 'Expired' },
  { code: 'DELIVERED_ORDER', description: 'Delivered' },
];

export const PaymentStatus: Record<string, string>[] = [
  { code: 'ALL', description: 'All' },
  { code: 'PARTIAL_PAYMENT', description: 'Partial payment' },
  { code: 'FULL_PAYMENT', description: 'Full Payment' },
];

export const AuditStatus: Record<string, string>[] = [
  { code: '', description: 'All' },
  { code: 'SUCCESS', description: 'Success' },
  { code: 'FAILED', description: 'Failed' },
];

export const AlertStatus: Record<string, string>[] = [
  { code: '', description: 'All' },
  { code: 'true', description: 'Read' },
  { code: 'false', description: 'Unread' },
];
