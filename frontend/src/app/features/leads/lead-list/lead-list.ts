import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Lead } from '../lead.model';
import { LeadService } from '../lead';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { StatusBadgePipe } from '../../../shared/status-badge-pipe';
@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, ConfirmDialog, NgClass, StatusBadgePipe],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.scss',
})
export class LeadList implements OnInit {
  leads = signal<Lead[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  showConfirm = signal(false);
  pendingDeleteId: number | null = null;

  constructor(
    private leadService: LeadService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLeads();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/leads') {
        this.loadLeads();
      }
    });
  }

  loadLeads(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.leadService.getAll().subscribe({
      next: (data) => {
        this.leads.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load leads');
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

    this.leadService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.leads.update((list) => list.filter((l) => l.id !== this.pendingDeleteId));
        this.showConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Failed to delete lead');
        this.showConfirm.set(false);
      },
    });
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }
}
