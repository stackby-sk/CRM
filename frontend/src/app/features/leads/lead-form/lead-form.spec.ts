import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadForm } from './lead-form';

describe('LeadForm', () => {
  let component: LeadForm;
  let fixture: ComponentFixture<LeadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
