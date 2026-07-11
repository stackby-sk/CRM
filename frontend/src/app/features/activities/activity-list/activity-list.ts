import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Activity } from '../activity.model';
import { ActivityService } from '../activity';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityList implements OnInit {
  activities = signal<Activity[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  deleteActivity(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this activity?')) return;

    this.activityService.delete(id).subscribe({
      next: () => {
        this.activities.update((list) => list.filter((a) => a.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete activity');
      },
    });
  }
}
