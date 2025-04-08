import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotificationData {
  type: 'success' | 'error' | 'warning' | 'info';
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<NotificationData | null>(null);
  notification$: Observable<NotificationData | null> = this.notificationSubject.asObservable();

  showNotification(type: 'success' | 'error' | 'warning' | 'info', content: string): void {
    this.notificationSubject.next({ type, content });
  }

  clearNotification(): void {
    this.notificationSubject.next(null);
  }
}
