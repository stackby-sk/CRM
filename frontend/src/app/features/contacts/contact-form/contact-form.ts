import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact';
import { CustomerService } from '../../customers/customer';
import { Customer } from '../../customers/customer.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId: number | null = null;
  errorMessage = signal('');
  customers = signal<Customer[]>([]);

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.contactForm = this.fb.group({
      customerId: ['', Validators.required],
      name: ['', Validators.required],
      role: [''],
      email: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.contactId = Number(idParam);
      this.loadContact(this.contactId);
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.errorMessage.set('Failed to load customers'),
    });
  }

  loadContact(id: number): void {
    this.contactService.getById(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue(contact);
      },
      error: () => {
        this.errorMessage.set('Failed to load contact');
      },
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }

    const request =
      this.isEditMode && this.contactId
        ? this.contactService.update(this.contactId, this.contactForm.value)
        : this.contactService.create(this.contactForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/contacts']);
      },
      error: () => {
        this.errorMessage.set('Failed to save contact');
      },
    });
  }
}
