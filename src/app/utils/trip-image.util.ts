import { Trip } from '../models/trip.interface';

/**
 * Genera una URL de imagen dinámica basada en el ID del viaje.
 * Usa Picsum Photos para obtener imágenes aleatorias.
 * Las imágenes NO se guardan en la base de datos.
 */
export function getTripImageUrl(trip: Trip): string {
    // Genera un número pseudo-aleatorio basado en el trip_id para que siempre 
    // sea la misma imagen para el mismo viaje
    const imageId = (trip.trip_id * 137) % 1000; // Números del 0-999

    // Picsum Photos proporciona imágenes de placeholder
    return `https://picsum.photos/id/${imageId}/800/600`;
}
