import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysLeft',
})
export class DaysLeftPipe implements PipeTransform {
  transform(startDate: string | Date, endDate: string | Date): string {
    if (!startDate || !endDate) return '';

    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const msPerDay = 1000 * 60 * 60 * 24;

    if (now < start) {
      const daysUntilStart = Math.ceil((start - now) / msPerDay);
      return `Starts in ${daysUntilStart}d`;
    }

    if (now >= start && now < end) {
      const daysLeft = Math.ceil((end - now) / msPerDay);
      return `${daysLeft}d left`;
    }

    return 'Completed';
  }
}
