import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionList } from './interaction-list';

describe('InteractionList', () => {
  let component: InteractionList;
  let fixture: ComponentFixture<InteractionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionList],
    }).compileComponents();

    fixture = TestBed.createComponent(InteractionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
