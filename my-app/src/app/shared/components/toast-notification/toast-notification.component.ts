import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastData } from '../../services/toast.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  showToast: boolean = false;
  message: string = '';
  type: 'success' | 'error' = 'success';

  private toastSubscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastSubscription = this.toastService.toast$.subscribe((toastData: ToastData) => {
      this.showToast = toastData.show;
      this.message = toastData.message;
      this.type = toastData.type;
    });
  }

  ngOnDestroy() {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }
} 