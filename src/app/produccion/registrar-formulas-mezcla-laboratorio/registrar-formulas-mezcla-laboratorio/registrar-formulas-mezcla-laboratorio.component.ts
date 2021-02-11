import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS } from './../registrar-formulas-mezcla-laboratorio.constant';
import { MapService } from 'src/app/shared/services/map.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-registrar-formulas-mezcla-laboratorio',
  templateUrl: './registrar-formulas-mezcla-laboratorio.component.html'
})
export class FormulaMezclaLaboratorioComponent implements OnInit {
 /** Constantes a usar en el componente */
  constants = CONST_PRODUCCION_REGISTRAR_FORMULAS_MEZCLAS;
  showCreate = true;



  /**
  * Método encargado de construir una instancia de la clase
  */
  constructor(
    private router: Router,
    private mapservice: MapService
  ) {
    //this.mapservice.getVisor().visible = false;
  }

  /** Método encargado de inicializar el componente */
  ngOnInit() {
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

  /** Método encargado de gestionar el llamado de las acciones
   * individuales de grilla por pk seleccionado
   *
   * @param event evento con nombre de la accion seleccionado por el usuario
   **/
  ejecutar( event: any) {
    this.showCreate = event.show;
  }
}
