import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList implements OnInit {
  contacts = signal<Contact[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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

  deleteContact(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this contact?')) return;

    this.contactService.delete(id).subscribe({
      next: () => {
        this.contacts.update((list) => list.filter((c) => c.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete contact');
      },
    });
  }
}
