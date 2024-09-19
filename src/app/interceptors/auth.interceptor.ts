import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Attach token to the request if available
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the HTTP response and errors
  return next(req).pipe(
    catchError((error) => {
      // Authorization error (token missing or expired)
      if (error.status === 401) {
        authService.clearToken();
        router.navigateByUrl('/login', { replaceUrl: true });
      }
      // Forbidden error (user lacks necessary privileges)
      else if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }
      // Not Found error (resource doesn't exist)
      // else if (error.status === 404) {
      //   router.navigate(['/not-found']);
      // }
      // Internal Server Error
      else if (error.status === 500) {
        router.navigate(['/internal-server']);
      }

      // Rethrow the error for any other handling needed elsewhere
      return throwError(() => error);
    })
  );
};
