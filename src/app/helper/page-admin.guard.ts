import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {APP_STORAGE_KEY} from "../const";
import {LocalstorageService} from '../shared/services/localstorage.service';


export const pageAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorageService = inject(LocalstorageService);
  const token = localStorageService.getValue<any>(APP_STORAGE_KEY.AUTHORIZED)?.token;
  if (token) {
    router.navigate(['/home']).then();
    return false;
  }
  return true;
};
