import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true,
})
export class StatusBadgePipe implements PipeTransform {
  private readonly colorMap: Record<string, string> = {
    NEW: 'bg-info text-dark',
    CONTACTED: 'bg-primary',
    QUALIFIED: 'bg-warning text-dark',
    WON: 'bg-success',
    LOST: 'bg-danger',
    PENDING: 'bg-warning text-dark',
    IN_PROGRESS: 'bg-primary',
    COMPLETED: 'bg-success',
  };

  transform(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    return this.colorMap[status] || 'bg-secondary';
  }
}
