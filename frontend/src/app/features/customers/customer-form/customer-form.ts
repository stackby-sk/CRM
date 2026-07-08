import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: number | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.customerId = Number(idParam);
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: number): void {
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
      },
      error: () => {
        this.errorMessage = 'Failed to load customer';
      },
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const request =
      this.isEditMode && this.customerId
        ? this.customerService.update(this.customerId, this.customerForm.value)
        : this.customerService.create(this.customerForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },
      error: () => {
        this.errorMessage = 'Failed to save customer';
      },
    });
  }
}
