import { HttpInterceptorFn } from '@angular/common/http';

export const permissionsPolicyInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};



// intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   // Clone the request to modify it
//   const modifiedRequest = request.clone({
//       headers: request.headers.delete('Permissions-Policy')
//   });

//   // Pass the modified request to the next handler
//   return next.handle(modifiedRequest);
// }

