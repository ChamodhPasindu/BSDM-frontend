import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from '../constants/session-data';
import { UserRole } from 'src/app/enums/UserRole.enum';

export const salesAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(StorageService);

  const token = storage.get(SESSION_DATA.ACCESS_TOKEN);
  const role = storage.get(SESSION_DATA.ROLE);

  if (token && role === UserRole.SALESMAN) return true;

  router.navigate(['/sales']);
  return false;
};

export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(StorageService);

  const token = storage.get(SESSION_DATA.ACCESS_TOKEN);
  const role = storage.get(SESSION_DATA.ROLE);

  if (token && role !== UserRole.SALESMAN) return true;

  router.navigate(['/admin']);
  return false;
};
