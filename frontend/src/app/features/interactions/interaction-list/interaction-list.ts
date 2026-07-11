import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Interaction } from '../interaction.model';
import { InteractionService } from '../interaction';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-interaction-list',
  standalone: true,
  imports: [RouterLink, DatePipe, ConfirmDialog],
  templateUrl: './interaction-list.html',
  styleUrl: './interaction-list.scss',
})
export class InteractionList implements OnInit {
  interactions = signal<Interaction[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  showConfirm = signal(false);
  pendingDeleteId: number | null = null;

  constructor(
    private interactionService: InteractionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadInteractions();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/interactions') {
        this.loadInteractions();
      }
    });
  }

  loadInteractions(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.interactionService.getAll().subscribe({
      next: (data) => {
        this.interactions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load interactions');
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

    this.interactionService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.interactions.update((list) => list.filter((i) => i.id !== this.pendingDeleteId));
        this.showConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Failed to delete interaction');
        this.showConfirm.set(false);
      },
    });
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }
}
