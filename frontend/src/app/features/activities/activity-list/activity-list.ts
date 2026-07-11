import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';
import { Activity } from '../activity.model';
import { ActivityService } from '../activity';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { StatusBadgePipe } from '../../../shared/status-badge-pipe';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [RouterLink, DatePipe, ConfirmDialog, NgClass, StatusBadgePipe],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityList implements OnInit {
  activities = signal<Activity[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  showConfirm = signal(false);
  pendingDeleteId: number | null = null;

  constructor(
    private activityService: ActivityService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadActivities();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/activities') {
        this.loadActivities();
      }
    });
  }

  loadActivities(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.activityService.getAll().subscribe({
      next: (data) => {
        this.activities.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load activities');
        this.loading.set(false);
      },
    });
  }

  requestDelete(id: number | undefined): void {
    if (!id) return;
    this.pendingDeleteId = id;
    this.showConfirm.set(true);
  }

  onConfirmDelete(): void {
    if (!this.pendingDeleteId) return;

    this.activityService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.activities.update((list) => list.filter((a) => a.id !== this.pendingDeleteId));
        this.showConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Failed to delete activity');
        this.showConfirm.set(false);
      },
    });
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }
}
