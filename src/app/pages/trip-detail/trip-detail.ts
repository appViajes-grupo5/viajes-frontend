import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.css']
})
export class TripDetailComponent implements OnInit {
  // Inyección de dependencias
  private tripService = inject(TripService);
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  private location = inject(Location);

  trip?: Trip; // Aquí guardamos los datos del viaje

  ngOnInit() {
    // 1. Obtenemos el ID de la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Si hay ID, pedimos el viaje al servicio
    if (id) {
      this.trip = this.tripService.getTripById(id);
    }
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }

  // Funcionalidad de BORRAR (La D de CRUD)
  deleteTrip() {
    // Primero verificamos que tenemos un viaje cargado
    if (!this.trip) return;

    // Pedimos confirmación al usuario
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar "${this.trip.title}"?`);

    if (confirmDelete) {
      // 1. Borramos del servicio
      this.tripService.deleteTrip(this.trip.trip_id);

      // 2. Redirigimos a la Home (o a /viajes)
      this.router.navigate(['/']);
    }
  }
}
