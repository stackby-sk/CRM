import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Customer } from '../customer.model';
import { CustomerService } from '../customer';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  customers = signal<Customer[]>([]);
  loading = signal(true);
  errorMessage = signal('');

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
  }

  loadCustomers(): void {
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

  deleteCustomer(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this customer?')) return;

    this.customerService.delete(id).subscribe({
      next: () => {
        this.customers.update((list) => list.filter((c) => c.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete customer');
      },
    });
  }
}
