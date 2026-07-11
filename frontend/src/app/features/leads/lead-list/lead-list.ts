import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Lead } from '../lead.model';
import { LeadService } from '../lead';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.scss',
})
export class LeadList implements OnInit {
  leads = signal<Lead[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  deleteLead(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this lead?')) return;

    this.leadService.delete(id).subscribe({
      next: () => {
        this.leads.update((list) => list.filter((l) => l.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete lead');
      },
    });
  }
}
