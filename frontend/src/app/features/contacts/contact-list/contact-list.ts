import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [RouterLink, ConfirmDialog],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList implements OnInit {
  contacts = signal<Contact[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  showConfirm = signal(false);
  pendingDeleteId: number | null = null;

  constructor(
    private contactService: ContactService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadContacts();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/contacts') {
        this.loadContacts();
      }
    });
  }

  loadContacts(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.contactService.getAll().subscribe({
      next: (data) => {
        this.contacts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load contacts');
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

    this.contactService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.contacts.update((list) => list.filter((c) => c.id !== this.pendingDeleteId));
        this.showConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Failed to delete contact');
        this.showConfirm.set(false);
      },
    });
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }
}
