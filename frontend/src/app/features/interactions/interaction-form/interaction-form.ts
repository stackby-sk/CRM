import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InteractionService } from '../interaction';
import { CustomerService } from '../../customers/customer';
import { Customer } from '../../customers/customer.model';

@Component({
  selector: 'app-interaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './interaction-form.html',
  styleUrl: './interaction-form.scss',
})
export class InteractionForm implements OnInit {
  interactionForm: FormGroup;
  errorMessage = signal('');
  customers = signal<Customer[]>([]);

  typeOptions = ['CALL', 'EMAIL', 'MEETING', 'NOTE'];

  constructor(
    private fb: FormBuilder,
    private interactionService: InteractionService,
    private customerService: CustomerService,
    private router: Router,
  ) {
    this.interactionForm = this.fb.group({
      customerId: ['', Validators.required],
      type: ['CALL', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.errorMessage.set('Failed to load customers'),
    });
  }

  onSubmit(): void {
    if (this.interactionForm.invalid) {
      return;
    }

    this.interactionService.create(this.interactionForm.value).subscribe({
      next: () => {
        this.router.navigate(['/interactions']);
      },
      error: () => {
        this.errorMessage.set('Failed to save interaction');
      },
    });
  }
}
