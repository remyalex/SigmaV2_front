import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Componente encargado de gestionar la páginas no encontradas */
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {


  /**
   * Método encargado de construir una instancia de componente
   * @param router Componente usado para redireccionar entre componentes
   */
  constructor(
    private router: Router
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
  }
  /** Método encargado de retornar al home*/
  goToHome() {
    this.router.navigate(['administracion/dashboard/home']);
  }

}
