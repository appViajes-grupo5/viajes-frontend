export interface Trip {
  trip_id: number;
  creator_id?: number; // Importante para identificar al creador
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
  
  // Datos del creador (en el backend)
  creator_first_name?: string;
  creator_last_name?: string;
  creator_email?: string;
  creator_phone?: string;
  creator_avatar?: string;
  
  participant_count?: number;
}
