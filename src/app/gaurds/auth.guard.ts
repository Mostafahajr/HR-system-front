import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log(route.data['pageName']);
    console.log(route.data['operation']);
    if (route.data['pageName'] && route.data['operation']) {
      const user = authService.currentUserValue;
      console.log(user);
      if (user && user.privileges) {
        const hasPrivilege = user.privileges.some(
          (privilege: any) =>
            privilege.page_name === route.data['pageName'] &&
            privilege.operation === route.data['operation']
        );
        console.log(hasPrivilege);

        if (!hasPrivilege) {
          router.navigate(['/unauthorized']);
          return false;
        }
      }
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
