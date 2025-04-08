import { Component, OnInit } from '@angular/core';
import {
  NotificationData,
  NotificationService,
} from '../../service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notification: NotificationData | null = null;
  timeoutId: any;
  isFadingOut = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((data) => {
      if (data && data !== this.notification) {
        this.isFadingOut = false;
        this.notification = data;

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.close(), 1000);
      }
    });
  }

  close(): void {
    clearTimeout(this.timeoutId);
    this.isFadingOut = true;

    setTimeout(() => {
      this.notificationService.clearNotification();
      this.isFadingOut = false;
      this.notification = null;
    }, 300);
  }
}
