import { ApplicationConfig, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { adminRoutes } from './admin/admin.routes';
import { clientRoutes } from './client/client.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { IMAGE_CONFIG } from '@angular/common';


const provideImageWarningDisabler = (): Provider => {
  return {
    provide: IMAGE_CONFIG, useValue: {
      disableImageSizeWarning: true,
      disableImageLazyLoadWarning: true,
    }
  }
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideRouter(adminRoutes),
    provideRouter(clientRoutes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideImageWarningDisabler(), provideAnimationsAsync(), provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
