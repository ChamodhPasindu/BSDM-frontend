export interface IAuditData {
  auditId: number;
  userId: number;
  username: string;
  role: string;
  action: string;
  entityName: string;
  entityId: number;
  status: string;
  ipAddress: string;
  userAgent: string;
  description: string;
  createdAt: string;
}
