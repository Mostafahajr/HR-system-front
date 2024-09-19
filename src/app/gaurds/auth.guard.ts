import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // Redirect to login page if there's no valid token
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // User is logged in, now check for specific privileges if required
  if (route.data['pageName'] && route.data['operation']) {
    const user = authService.currentUserValue;
    if (user && user.privileges) {
      const hasPrivilege = user.privileges.some(
        (privilege: any) =>
          privilege.page_name === route.data['pageName'] &&
          privilege.operation === route.data['operation']
      );

      if (!hasPrivilege) {
        router.navigate(['/unauthorized']);
        return false;
      }
    }
  }

  return true;
};
