import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Si no es una petición a la API, no hacemos nada
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Si tenemos token, clonamos la petición y añadimos el header
  if (authToken) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(clonedReq);
  }

  // Si no hay token, dejamos pasar la petición original
  return next(req);
};
