import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONST_REGISTRAR_PLANILLA_OPERACION } from './../personal-planta.constant';


@Component({
  selector: 'sigma-pruduccion-personal-planta-admin',
  templateUrl: './personal-planta-admin.component.html'
})
export class PersonalPlantaAdminComponent implements OnInit {

 /** Constantes a usar en el componente */
  constants = CONST_REGISTRAR_PLANILLA_OPERACION;
  /** Variable pk que recibe por URL - uso en Widget */
  public pk: Number;
  /**
  * Método encargado de construir una instancia de componente
  *
  * @param router Componente usado para redireccionar entre componentes
  */
  constructor(
    private router: Router,
    private _route: ActivatedRoute
  ) { }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
    const pk = this._route.snapshot.paramMap.get('pk');
    if (pk !== null && pk.length > 0) {
      this.pk = Number(pk);
    }
  }
  /**
   * Método encargado de realizar el llamado del componente encagado de
   * gestionar la creación de un objeto del componente.
   */
  create(): void {
    const posUltimaPosicion = location.pathname.lastIndexOf('/');
    const urlBack = location.pathname.substr(0, posUltimaPosicion + 1) + 'create';
    this.router.navigate([urlBack]);
  }
}
