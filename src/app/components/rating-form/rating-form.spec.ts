import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingForm } from './rating-form';

describe('RatingForm', () => {
  let component: RatingForm;
  let fixture: ComponentFixture<RatingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
