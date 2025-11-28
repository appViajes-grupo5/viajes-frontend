import { Injectable, signal } from '@angular/core';
import { Trip } from '../models/trip.interface';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en TODA la app
})
export class TripService {

  // 1. ESTADO (Privado): Aquí guardamos los datos "crudos".
  // Inicializamos con algunos datos de prueba para ver algo en pantalla.
  private _trips = signal<Trip[]>([
    {
      trip_id: 1,
      title: 'Aventura en Costa Rica',
      description: 'Explora selvas, volcanes y playas vírgenes en este paraíso natural.',
      destination: 'Costa Rica',
      start_date: '2024-06-15',
      end_date: '2024-06-25',
      estimated_cost: 1200,
      min_participants: 4,
      transport_details: 'Vuelo + 4x4',
      itinerary: 'Día 1: San José, Día 2: Tortuguero...',
      image_url: 'https://picsum.photos/id/1015/800/600'
    },
    {
      trip_id: 2,
      title: 'Ruta Gastronómica en Italia',
      description: 'Disfruta de la mejor pasta y vino en la Toscana.',
      destination: 'Italia',
      start_date: '2024-09-10',
      end_date: '2024-09-17',
      estimated_cost: 850,
      min_participants: 2,
      transport_details: 'Minibús privado',
      itinerary: 'Roma -> Florencia -> Siena',
      image_url: 'https://picsum.photos/id/1040/800/600'
    },
    {
      trip_id: 3,
      title: 'Auroras Boreales',
      description: 'Caza auroras en el círculo polar ártico.',
      destination: 'Islandia',
      start_date: '2024-11-05',
      end_date: '2024-11-12',
      estimated_cost: 1600,
      min_participants: 3,
      transport_details: '4x4 Super Jeep',
      itinerary: 'Reykjavik -> Golden Circle -> Vik',
      image_url: 'https://picsum.photos/id/1036/800/600'
    }
  ]);

  // 2. LECTURA (Pública): Exponemos la signal como solo lectura.
  // Los componentes usarán esto: tripService.trips()
  trips = this._trips.asReadonly();

  // 3. MÉTODOS DE ACCIÓN (CRUD)

  // Obtener un solo viaje por ID (Para la página de detalle)
  getTripById(id: number): Trip | undefined {
    return this._trips().find(t => t.trip_id === id);
  }

  // Crear un nuevo viaje
  addTrip(trip: Trip): number {
    // 1. Calculamos el ID
    const newId = this._trips().length > 0 ? Math.max(...this._trips().map(t => t.trip_id)) + 1 : 1;
    const newTrip = { ...trip, trip_id: newId };

    // 2. ¡PRIMERO GUARDAMOS! (Importante hacerlo antes del return)
    this._trips.update(values => [...values, newTrip]);

    // 3. DESPUÉS devolvemos el ID y salimos de la función
    return newId;
}

  // Editar un viaje existente
  updateTrip(updatedTrip: Trip) {
    this._trips.update(values =>
      values.map(t => t.trip_id === updatedTrip.trip_id ? updatedTrip : t)
    );
  }

  // Borrar viaje (Bonus)
  deleteTrip(id: number) {
    this._trips.update(values => values.filter(t => t.trip_id !== id));
  }
}
