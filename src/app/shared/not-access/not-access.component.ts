import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Componente encargado de no permitir el acceso a páginas que
 *  usuarios  no tengan el permiso */
@Component({
  selector: 'app-not-access',
  templateUrl: './not-access.component.html',
  styleUrls: ['./not-access.component.scss']
})
export class NotAccessComponent implements OnInit {

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
  scrollToDemos() {
    this.router.navigate(['administracion/dashboard/home']);
  }
}
