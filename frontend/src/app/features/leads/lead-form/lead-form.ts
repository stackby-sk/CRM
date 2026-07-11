import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from '../lead';
import { CustomerService } from '../../customers/customer';
import { Customer } from '../../customers/customer.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm implements OnInit {
  leadForm: FormGroup;
  isEditMode = false;
  leadId: number | null = null;
  errorMessage = signal('');
  customers = signal<Customer[]>([]);

  statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.leadForm = this.fb.group({
      customerId: ['', Validators.required],
      source: [''],
      status: ['NEW'],
      value: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.leadId = Number(idParam);
      this.loadLead(this.leadId);
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.errorMessage.set('Failed to load customers'),
    });
  }

  loadLead(id: number): void {
    this.leadService.getById(id).subscribe({
      next: (lead) => {
        this.leadForm.patchValue(lead);
      },
      error: () => {
        this.errorMessage.set('Failed to load lead');
      },
    });
  }

  onSubmit(): void {
    if (this.leadForm.invalid) {
      return;
    }

    const request =
      this.isEditMode && this.leadId
        ? this.leadService.update(this.leadId, this.leadForm.value)
        : this.leadService.create(this.leadForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/leads']);
      },
      error: () => {
        this.errorMessage.set('Failed to save lead');
      },
    });
  }
}
