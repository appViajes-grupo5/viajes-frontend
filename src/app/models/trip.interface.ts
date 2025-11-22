// src/app/models/trip.interface.ts
export interface Trip {
  trip_id: number;
  title: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
  estimated_cost: number;
  min_participants: number;
  transport_details: string;
  itinerary: string;
  image_url?: string;
}

