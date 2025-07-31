import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastData>({
    show: false,
    message: '',
    type: 'success'
  });

  public toast$ = this.toastSubject.asObservable();

  /**
   * Muestra una notificación toast
   * @param message - Mensaje a mostrar
   * @param type - Tipo de notificación ('success' o 'error')
   * @param duration - Duración en milisegundos (por defecto 4000ms)
   */
  public showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 4000) {
    this.toastSubject.next({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  /**
   * Oculta la notificación toast
   */
  hideToast() {
    this.toastSubject.next({
      show: false,
      message: '',
      type: 'success'
    });
  }

  /**
   * Muestra un toast de éxito
   * @param message - Mensaje a mostrar
   * @param duration - Duración en milisegundos (por defecto 4000ms)
   */
  showSuccess(message: string, duration?: number) {
    this.showToast(message, 'success', duration);
  }

  /**
   * Muestra un toast de error
   * @param message - Mensaje a mostrar
   * @param duration - Duración en milisegundos (por defecto 4000ms)
   */
  showError(message: string, duration?: number) {
    this.showToast(message, 'error', duration);
  }
} 