import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // From the first config
    provideRouter(routes), // Shared by both configs
    provideHttpClient(withInterceptors([authInterceptor])), // Merged with interceptor
    provideAnimationsAsync(), // From the first config
    {
      provide: 'API_URL', // From the second config
      useValue: 'http://pioneer-back2.test/api',
    },
  ],
};
