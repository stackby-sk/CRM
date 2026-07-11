import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink, ConfirmDialog, ReactiveFormsModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  showConfirm = signal(false);
  pendingDeleteId: number | null = null;
  searchControl = new FormControl('');
  searchTerm = signal('');

  filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.customers();
    return this.customers().filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.company?.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term),
    );
  });
  constructor(
    private customerService: CustomerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url === '/customers') {
        this.loadCustomers();
      }
    });
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.searchTerm.set(value || '');
    });
  }

  loadCustomers(): void {
    this.errorMessage.set('');
    this.loading.set(true);
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load customers');
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

    this.customerService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.customers.update((list) => list.filter((c) => c.id !== this.pendingDeleteId));
        this.showConfirm.set(false);
        this.pendingDeleteId = null;
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Failed to delete customer');
        this.showConfirm.set(false);
      },
    });
  }

  onCancelDelete(): void {
    this.showConfirm.set(false);
    this.pendingDeleteId = null;
  }
}
