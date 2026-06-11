import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        const body = event.body as any;

        if (body.success === true) {
          return event.clone({
            body: body.data,
          });
        }
      }

      return event;
    }),
  );
};
