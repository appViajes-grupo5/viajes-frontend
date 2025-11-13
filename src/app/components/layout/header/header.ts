// PASO 1: Importar las herramientas
import { Component, HostListener, HostBinding, OnInit } from '@angular/core';
// ¡IMPORTANTE! Importamos RouterLink para que [routerLink] funcione en el HTML
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
// Le dice a Angular que este componente no necesita un 'NgModule'.
  standalone: true,
 // las directivas 'routerLink' y 'fragment' en tu HTML".
  imports: [RouterLink],
// Le dice a Angular: "Tu HTML está en este archivo".
  templateUrl: './header.html',
  styleUrls: ['./header.css']

})

export class HeaderComponent implements OnInit {


  private isScrolled = false;

  // PASO 4: Vincular la clase '.navbar-scrolled' (Binding)
  @HostBinding('class.navbar-scrolled')
  get applyNavbarScrolledClass(): boolean {
    return this.isScrolled;
  }

  // PASO 5: Vincular la clase '.bg-transparent'
  @HostBinding('class.bg-transparent')
  get applyBgTransparentClass(): boolean {
    return !this.isScrolled;
  }

  // PASO 6: Escuchar el evento de scroll (Listener)
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  // PASO 7: Ejecutar la comprobación al cargar (OnInit)
  ngOnInit(): void {
    this.onWindowScroll();
  }
}

