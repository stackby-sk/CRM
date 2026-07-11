import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Interaction } from '../interaction.model';
import { InteractionService } from '../interaction';

@Component({
  selector: 'app-interaction-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './interaction-list.html',
  styleUrl: './interaction-list.scss',
})
export class InteractionList implements OnInit {
  interactions = signal<Interaction[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  deleteInteraction(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this interaction?')) return;

    this.interactionService.delete(id).subscribe({
      next: () => {
        this.interactions.update((list) => list.filter((i) => i.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete interaction');
      },
    });
  }
}
