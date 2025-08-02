import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() calendarClosed = new EventEmitter<void>();

  currentDate: Date = new Date();
  
  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get currentMonth(): number {
    return this.currentDate.getMonth();
  }

  get currentMonthName(): string {
    return this.months[this.currentMonth];
  }

  get calendarDays(): CalendarDay[] {
    const year = this.currentYear;
    const month = this.currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    
    const days: CalendarDay[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day: day,
        date: date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
      
      days.push({
        day: day,
        date: date,
        isCurrentMonth: true,
        isToday: isToday,
        isSelected: isSelected || false
      });
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        day: day,
        date: date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  selectDate(day: CalendarDay): void {
    if (day.isCurrentMonth) {
      this.selectedDate = day.date;
    }
  }

  confirmSelection(): void {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
    }
    this.closeCalendar();
  }

  cancelSelection(): void {
    this.closeCalendar();
  }

  closeCalendar(): void {
    this.isVisible = false;
    this.calendarClosed.emit();
  }

  onBackdropClick(): void {
    this.closeCalendar();
  }
}

interface CalendarDay {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}
