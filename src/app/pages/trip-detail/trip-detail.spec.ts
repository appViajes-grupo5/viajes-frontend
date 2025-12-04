import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDetailComponent } from './trip-detail';
import { TripService } from '../../services/trip.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let fixture: ComponentFixture<TripDetailComponent>;

  const tripServiceMock = {
    getTripById: (id: number) => of({
      trip_id: id,
      title: 'Test Trip',
      description: 'Desc',
      destination: 'Dest',
      start_date: '2024-01-01',
      end_date: '2024-01-05',
      estimated_cost: 100,
      min_participants: 1,
      transport_details: 'Bus',
      itinerary: 'Itinerary',
      image_url: 'img.jpg'
    }),
    joinTrip: (id: number) => { },
    deleteTrip: (id: number) => of({})
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: (key: string) => '1'
      }
    }
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const locationMock = {
    back: jasmine.createSpy('back')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailComponent],
      providers: [
        { provide: TripService, useValue: tripServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trip details on init', () => {
    expect(component.trip).toBeDefined();
    expect(component.trip?.title).toBe('Test Trip');
  });
});
