import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Componente encargado de gestionar las listas items */
@Component({
  selector: 'app-listas-items-admin',
  templateUrl: './listas-items-admin.component.html'
})
export class ListasItemsAdminComponent implements OnInit {

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

   /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    this.router.navigateByUrl('/administracion/listasItems/create');
  }

}
