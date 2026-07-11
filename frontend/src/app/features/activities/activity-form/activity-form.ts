import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../activity';
import { CustomerService } from '../../customers/customer';
import { Customer } from '../../customers/customer.model';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss',
})
export class ActivityForm implements OnInit {
  activityForm: FormGroup;
  isEditMode = false;
  activityId: number | null = null;
  errorMessage = signal('');
  customers = signal<Customer[]>([]);

  typeOptions = ['CALL', 'EMAIL', 'MEETING', 'TASK'];
  statusOptions = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.activityForm = this.fb.group({
      customerId: ['', Validators.required],
      type: ['TASK', Validators.required],
      dueDate: [''],
      status: ['PENDING'],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.activityId = Number(idParam);
      this.loadActivity(this.activityId);
    }
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: () => this.errorMessage.set('Failed to load customers'),
    });
  }

  loadActivity(id: number): void {
    this.activityService.getById(id).subscribe({
      next: (activity) => {
        this.activityForm.patchValue(activity);
      },
      error: () => {
        this.errorMessage.set('Failed to load activity');
      },
    });
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      return;
    }

    const request =
      this.isEditMode && this.activityId
        ? this.activityService.update(this.activityId, this.activityForm.value)
        : this.activityService.create(this.activityForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/activities']);
      },
      error: () => {
        this.errorMessage.set('Failed to save activity');
      },
    });
  }
}
