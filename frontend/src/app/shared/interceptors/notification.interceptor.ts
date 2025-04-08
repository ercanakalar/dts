import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { NotificationService } from '../service/notification.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(
      (event) => {
        if (event instanceof HttpResponse) {
          const body: any = event.body;
          if (body.errors) {
            return notificationService.showNotification(
              'error',
              body.errors[0].message,
            );
          }
          const message = body.data?.message;
          if (message) notificationService.showNotification('success', message);
        }
      },
      (error) => console.log('Response error:', error),
    ),
  );
};
