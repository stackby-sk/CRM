import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionForm } from './interaction-form';

describe('InteractionForm', () => {
  let component: InteractionForm;
  let fixture: ComponentFixture<InteractionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
