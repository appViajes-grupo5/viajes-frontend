import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripListComponent } from './trip-list';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { of } from 'rxjs';

describe('TripListComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;

  const authServiceMock = {
    getCurrentUser: () => ({ id: 1, name: 'Test User' })
  };

  const tripServiceMock = {
    getTrips: () => of([
      {
        trip_id: 1,
        title: 'Test Trip',
        description: 'Description',
        destination: 'Dest',
        start_date: '2024-01-01',
        end_date: '2024-01-05',
        estimated_cost: 100,
        min_participants: 1,
        transport_details: 'Bus',
        itinerary: 'Itinerary'
      }
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripListComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TripService, useValue: tripServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trips on init', () => {
    expect(component.trips.length).toBe(1);
    expect(component.trips[0].title).toBe('Test Trip');
  });
});
