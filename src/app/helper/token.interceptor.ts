import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_STORAGE_KEY } from '../const';
import {LocalstorageService} from '../shared/services/localstorage.service';
import {NotificationService} from '../shared/services/notification.service';
import {AuthService} from '../pages/auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);
  const localStorageService = inject(LocalstorageService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  let isRefreshing = false;
  const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  const addToken = (request: any, token: string) => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': translate.currentLang || 'en',
      },
    });
  };
  const handle401Error = (request: any, authorized: any) => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken(authorized?.token).pipe(
        switchMap((result: any) => {
          if (result?.accessToken) {
            isRefreshing = false;
            authorized.token = result.accessToken;
            refreshTokenSubject.next(authorized.token);

            localStorageService.setValue({
              key: APP_STORAGE_KEY.AUTHORIZED,
              value: authorized,
            });
            localStorageService.setValue({
              key: APP_STORAGE_KEY.AUTHORIZED,
              value: authorized,
            })
            return next(addToken(request, result.accessToken));
          } else {
            isRefreshing = false;
            localStorageService.removeValue(APP_STORAGE_KEY.AUTHORIZED);
            localStorageService.removeValue(APP_STORAGE_KEY.AUTHORIZED);
            router.navigate(['/']).then();
            return throwError(() => new Error('Failed to refresh token'));
          }
        }),
        catchError((error: any) => {
          isRefreshing = false;
          localStorageService.removeValue(APP_STORAGE_KEY.AUTHORIZED);
          localStorageService.removeValue(APP_STORAGE_KEY.AUTHORIZED);
          router.navigate(['/']).then();
          return throwError(() => error);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => next(addToken(request, jwt)))
      );
    }
  };


  const authorized = localStorageService.getValue<any>(APP_STORAGE_KEY.AUTHORIZED) ?? localStorageService.getValue<any>(APP_STORAGE_KEY.AUTHORIZED);
  const token = authorized?.token;

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error?.status === 401) {
        return handle401Error(req, authorized);
      } else {
        if (req.headers.get('disableErrorNotification') !== 'yes') {
          const errorMessage = error.error.message || error.message || 'Something went wrong';
          notificationService.showError(errorMessage);
        }
        return throwError(() => error);
      }
    })
  );

};
